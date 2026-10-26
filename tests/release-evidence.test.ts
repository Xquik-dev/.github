// Copyright the Xquik contributors.
// SPDX-License-Identifier: MIT

import assert from "node:assert/strict";
import { createHash, generateKeyPairSync, sign } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { crc32, deflateRawSync } from "node:zlib";
import {
  EVIDENCE,
  MAVEN_KEY,
  PROJECTS,
  TERRAFORM_KEY,
  guideProblem,
  hasValidNpmSignature,
  renderEvidenceTable,
  requestHeaders,
  verifyProject,
  zipDigests,
} from "../scripts/release-evidence.ts";
import { root } from "./helpers.ts";

const API = "https://api.github.com/repos/Xquik-dev";
const COMMIT = "1111111111111111111111111111111111111111";
const digest = (content) => createHash("sha256").update(content).digest("hex");
const project = (repo) => PROJECTS.find((candidate) => candidate.repo === repo);
const asset = (name, content) => ({
  browser_download_url: `https://downloads.test/${name}`,
  digest: `sha256:${digest(content)}`,
  name,
});

// The GitHub answers every project needs: its latest release, its default branch and the comparison.
function github(repo, { tag = "v1.2.3", assets = [], status = "behind" } = {}) {
  return {
    [`${API}/${repo}/releases/latest`]: { assets, tag_name: tag },
    [`${API}/${repo}`]: { default_branch: "main" },
    [`${API}/${repo}/compare/main...${tag}`]: { status },
    [`${API}/${repo}/commits/${tag}`]: { sha: COMMIT },
  };
}

// A fake that answers only the listed addresses and records every command.
// ghStatus is 1 exit status for every gh call, or a list with 1 status per call.
function fakeIo(responses, { signers = [], ghStatus = 0 } = {}) {
  const commands = [];
  const statuses = [ghStatus].flat();
  const answer = (url) => {
    assert.ok(url in responses, `unexpected request ${url}`);
    return responses[url];
  };
  return {
    bytes: async (url) => Buffer.from(answer(url)),
    commands,
    json: async (url) => answer(url),
    readFile: async (path) => `public key in ${path}`,
    run: async (command, args) => {
      commands.push([command, ...args].join(" "));
      const status = statuses.length > 1 ? statuses.shift() : statuses[0];
      return { status, stderr: status === 0 ? "" : "Error: could not reach the trust root\n", stdout: "" };
    },
    signers: async ({ key }) => {
      commands.push(`gpg verify with ${String(key).slice(0, 60)}`);
      return signers;
    },
    text: async (url) => answer(url),
    wait: async (milliseconds) => {
      commands.push(`wait ${milliseconds}`);
    },
  };
}

async function failure(repo, responses, options) {
  const error = await verifyProject(project(repo), fakeIo(responses, options)).catch((caught) => caught);
  assert.ok(error instanceof Error, "the verification passed");
  return error.message;
}

const pypi = (version, files = {}) => ({
  info: { version },
  urls: Object.entries(files).map(([filename, content]) => ({ digests: { sha256: digest(content) }, filename })),
});

test("a project passes when its tag is on the default branch and the registry has that version", async () => {
  const responses = { ...github("prefect-xquik"), "https://pypi.org/pypi/prefect-xquik/json": pypi("1.2.3") };
  assert.equal(
    await verifyProject(project("prefect-xquik"), fakeIo(responses)),
    "prefect-xquik v1.2.3 has 2 kinds of evidence.",
  );
});

for (const status of ["ahead", "diverged"]) {
  test(`a tag that is ${status} of the default branch fails`, async () => {
    const responses = { ...github("prefect-xquik", { status }), "https://pypi.org/pypi/prefect-xquik/json": pypi("1.2.3") };
    assert.equal(
      await failure("prefect-xquik", responses),
      'prefect-xquik v1.2.3 lacks "Release tag on the default branch". tag v1.2.3 is not on main.',
    );
  });
}

test("a registry version that differs from the release tag fails", async () => {
  const responses = { ...github("prefect-xquik"), "https://pypi.org/pypi/prefect-xquik/json": pypi("1.2.4") };
  assert.equal(
    await failure("prefect-xquik", responses),
    'prefect-xquik v1.2.3 lacks "Registry version equals the tag". PyPI has 1.2.4, and the latest release tag is v1.2.3.',
  );
});

// An npm manifest signed the way the registry signs, with a key made for this test.
const { privateKey, publicKey } = generateKeyPairSync("ec", { namedCurve: "P-256" });
const registryKeys = [{ key: publicKey.export({ format: "der", type: "spki" }).toString("base64"), keyid: "SHA256:test" }];
function manifest(name, version, change = {}) {
  const integrity = "sha512-fixture";
  const sig = sign("sha256", Buffer.from(`${name}@${version}:${integrity}`), privateKey).toString("base64");
  return {
    dist: { integrity, signatures: [{ keyid: "SHA256:test", sig }], tarball: "https://registry.test/package.tgz" },
    name,
    version,
    ...change,
  };
}

test("an npm manifest signed by a registry key is valid", () => {
  assert.equal(hasValidNpmSignature(manifest("x-developer", "1.2.3"), registryKeys), true);
});

for (const [name, tampered, keys] of [
  ["another version", manifest("x-developer", "1.2.3", { version: "1.2.4" }), registryKeys],
  ["another package", manifest("x-developer", "1.2.3", { name: "x-developers" }), registryKeys],
  ["an unknown key", manifest("x-developer", "1.2.3"), [{ ...registryKeys[0], keyid: "SHA256:other" }]],
  ["no signature", manifest("x-developer", "1.2.3", { dist: { integrity: "sha512-fixture" } }), registryKeys],
]) {
  test(`an npm signature over ${name} is not valid`, () => {
    assert.equal(hasValidNpmSignature(tampered, keys), false);
  });
}

function typescript({ tarball = "tarball", signed = manifest("x-twitter-scraper", "1.2.3") } = {}) {
  return {
    ...github("x-twitter-scraper-typescript", { assets: [asset("x-twitter-scraper-1.2.3.tgz", "tarball")] }),
    "https://registry.npmjs.org/-/npm/v1/keys": { keys: registryKeys },
    "https://registry.npmjs.org/x-twitter-scraper/latest": signed,
    "https://registry.test/package.tgz": tarball,
  };
}

test("an npm project with a release asset and an attestation passes all 5 checks", async () => {
  const io = fakeIo(typescript());
  assert.equal(
    await verifyProject(project("x-twitter-scraper-typescript"), io),
    "x-twitter-scraper-typescript v1.2.3 has 5 kinds of evidence.",
  );
  assert.deepEqual(io.commands, ["gh release verify v1.2.3 --repo Xquik-dev/x-twitter-scraper-typescript"]);
});

test("a release attestation that fails once passes on the next try", async () => {
  const io = fakeIo(typescript(), { ghStatus: [1, 0] });
  assert.match(await verifyProject(project("x-twitter-scraper-typescript"), io), /has 5 kinds of evidence/u);
  assert.deepEqual(io.commands, [
    "gh release verify v1.2.3 --repo Xquik-dev/x-twitter-scraper-typescript",
    "wait 2000",
    "gh release verify v1.2.3 --repo Xquik-dev/x-twitter-scraper-typescript",
  ]);
});

test("a scoped npm package is read by its encoded name", async () => {
  const responses = {
    ...github("tweetclaw"),
    "https://registry.npmjs.org/-/npm/v1/keys": { keys: registryKeys },
    "https://registry.npmjs.org/@xquik%2ftweetclaw/latest": manifest("@xquik/tweetclaw", "1.2.3"),
  };
  assert.match(await verifyProject(project("tweetclaw"), fakeIo(responses)), /^tweetclaw v1\.2\.3 has 3 kinds/u);
});

for (const [name, responses, options, message] of [
  ["a tarball that differs from the release asset", typescript({ tarball: "other" }), {}, '"Release asset equals the npm tarball". x-twitter-scraper-1.2.3.tgz differs from the npm tarball.'],
  ["a manifest no registry key signed", typescript({ signed: manifest("x-twitter-scraper", "1.2.3", { dist: { integrity: "sha512-other", tarball: "https://registry.test/package.tgz" } }) }), {}, '"npm registry signature". no npm registry key signed the latest version.'],
  ["a release GitHub does not attest", typescript(), { ghStatus: 1 }, '"GitHub release attestation". gh release verify v1.2.3 failed 3 times. Error: could not reach the trust root.'],
]) {
  test(`${name} fails`, async () => {
    assert.equal(await failure("x-twitter-scraper-typescript", responses, options), `x-twitter-scraper-typescript v1.2.3 lacks ${message}`);
  });
}

function hermes(assets) {
  return {
    ...github("hermes-tweet", { assets }),
    "https://pypi.org/pypi/hermes-tweet/json": pypi("1.2.3", { "hermes_tweet-1.2.3.tar.gz": "sdist", "hermes_tweet-1.2.3-py3-none-any.whl": "wheel" }),
  };
}

test("release assets with the digests of the PyPI files pass", async () => {
  const assets = [asset("hermes_tweet-1.2.3.tar.gz", "sdist"), asset("hermes_tweet-1.2.3-py3-none-any.whl", "wheel")];
  assert.match(await verifyProject(project("hermes-tweet"), fakeIo(hermes(assets))), /has 3 kinds of evidence/u);
});

for (const [name, assets, message] of [
  ["a release asset that differs from the PyPI file", [asset("hermes_tweet-1.2.3.tar.gz", "sdist"), asset("hermes_tweet-1.2.3-py3-none-any.whl", "other")], "hermes_tweet-1.2.3-py3-none-any.whl differs from the PyPI file."],
  ["a PyPI file with no release asset", [asset("hermes_tweet-1.2.3-py3-none-any.whl", "wheel")], "release v1.2.3 has no asset hermes_tweet-1.2.3.tar.gz."],
]) {
  test(`${name} fails`, async () => {
    assert.equal(await failure("hermes-tweet", hermes(assets)), `hermes-tweet v1.2.3 lacks "Release assets equal the PyPI files". ${message}`);
  });
}

const MAVEN = "https://repo1.maven.org/maven2/com/xquik/api/x-twitter-scraper-java";
const java = {
  ...github("x-twitter-scraper-java"),
  [`${MAVEN}/maven-metadata.xml`]: "<metadata><versioning><release>1.2.3</release></versioning></metadata>",
  [`${MAVEN}/1.2.3/x-twitter-scraper-java-1.2.3.jar`]: "jar",
  [`${MAVEN}/1.2.3/x-twitter-scraper-java-1.2.3.jar.asc`]: "signature",
};

test("a JAR signed by the pinned Maven key passes, with the key from this repository", async () => {
  const io = fakeIo(java, { signers: [MAVEN_KEY] });
  assert.match(await verifyProject(project("x-twitter-scraper-java"), io), /has 3 kinds of evidence/u);
  assert.deepEqual(io.commands, ["gpg verify with public key in keys/xquik-maven-central.asc"]);
});

test("a JAR signed by another key fails", async () => {
  assert.equal(
    await failure("x-twitter-scraper-java", java, { signers: [TERRAFORM_KEY] }),
    'x-twitter-scraper-java v1.2.3 lacks "OpenPGP signature from the Xquik Maven key". the Xquik Maven key did not sign the latest JAR.',
  );
});

const PROVIDER = "terraform-provider-x-twitter-scraper";
const REGISTRY = "https://registry.terraform.io/v1/providers/Xquik-dev/x-twitter-scraper";
function terraform(sums, extra = []) {
  const assets = [
    asset(`${PROVIDER}_1.2.3_linux_amd64.zip`, "linux"),
    asset(`${PROVIDER}_1.2.3_darwin_arm64.zip`, "darwin"),
    asset(`${PROVIDER}_1.2.3_SHA256SUMS`, sums),
    asset(`${PROVIDER}_1.2.3_SHA256SUMS.sig`, "signature"),
    ...extra,
  ];
  return {
    ...github(PROVIDER, { assets }),
    [REGISTRY]: { version: "1.2.3" },
    [`${REGISTRY}/1.2.3/download/linux/amd64`]: { signing_keys: { gpg_public_keys: [{ ascii_armor: "registry key" }] } },
    [`https://downloads.test/${PROVIDER}_1.2.3_SHA256SUMS`]: sums,
    [`https://downloads.test/${PROVIDER}_1.2.3_SHA256SUMS.sig`]: "signature",
  };
}
const SUMS = `${digest("linux")}  ${PROVIDER}_1.2.3_linux_amd64.zip\n${digest("darwin")}  ${PROVIDER}_1.2.3_darwin_arm64.zip\n`;

test("checksums signed by the pinned Terraform key that match every archive pass", async () => {
  const io = fakeIo(terraform(SUMS), { signers: [TERRAFORM_KEY] });
  assert.match(await verifyProject(project(PROVIDER), io), /has 4 kinds of evidence/u);
  assert.deepEqual(io.commands, ["gpg verify with registry key", `gh release verify v1.2.3 --repo Xquik-dev/${PROVIDER}`]);
});

for (const [name, responses, signers, message] of [
  ["checksums signed by another key", terraform(SUMS), [MAVEN_KEY], "the Xquik Terraform key did not sign the checksum file."],
  ["a checksum that differs from the archive", terraform(SUMS.replace(digest("linux"), digest("other"))), [TERRAFORM_KEY], `the checksum of ${PROVIDER}_1.2.3_linux_amd64.zip differs from the release asset.`],
  ["an archive the checksum file does not list", terraform(SUMS, [asset(`${PROVIDER}_1.2.3_windows_amd64.zip`, "windows")]), [TERRAFORM_KEY], `the checksum file does not list ${PROVIDER}_1.2.3_windows_amd64.zip.`],
  ["an empty checksum file", terraform("\n"), [TERRAFORM_KEY], "the checksum file is empty."],
]) {
  test(`${name} fails`, async () => {
    assert.equal(await failure(PROVIDER, responses, { signers }), `${PROVIDER} v1.2.3 lacks "Checksums signed by the Xquik Terraform key". ${message}`);
  });
}

function cli(sums) {
  const assets = [asset("x-twitter-scraper_1.2.3_linux_amd64.tar.gz", "archive"), asset("x-twitter-scraper_1.2.3_checksums.txt", sums)];
  return { ...github("x-twitter-scraper-cli", { assets }), "https://downloads.test/x-twitter-scraper_1.2.3_checksums.txt": sums };
}

test("a checksum file that matches the release assets passes", async () => {
  const sums = `${digest("archive")}  x-twitter-scraper_1.2.3_linux_amd64.tar.gz\n`;
  assert.match(await verifyProject(project("x-twitter-scraper-cli"), fakeIo(cli(sums))), /has 2 kinds of evidence/u);
});

test("a checksum file that differs from a release asset fails", async () => {
  const sums = `${digest("other")}  x-twitter-scraper_1.2.3_linux_amd64.tar.gz\n`;
  assert.equal(
    await failure("x-twitter-scraper-cli", cli(sums)),
    'x-twitter-scraper-cli v1.2.3 lacks "Checksum file matches the release assets". the checksum of x-twitter-scraper_1.2.3_linux_amd64.tar.gz differs from the release asset.',
  );
});

// Builds a ZIP archive the way a packer does, stored or deflated.
function zip(files, { deflate = false } = {}) {
  const locals = [];
  const directory = [];
  let offset = 0;
  for (const [name, content] of Object.entries(files)) {
    const data = Buffer.from(content);
    const stored = deflate ? deflateRawSync(data) : data;
    const nameBytes = Buffer.from(name);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(deflate ? 8 : 0, 8);
    local.writeUInt32LE(crc32(data), 14);
    local.writeUInt32LE(stored.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(nameBytes.length, 26);
    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(deflate ? 8 : 0, 10);
    central.writeUInt32LE(crc32(data), 16);
    central.writeUInt32LE(stored.length, 20);
    central.writeUInt32LE(data.length, 24);
    central.writeUInt16LE(nameBytes.length, 28);
    central.writeUInt32LE(offset, 42);
    locals.push(local, nameBytes, stored);
    directory.push(central, nameBytes);
    offset += local.length + nameBytes.length + stored.length;
  }
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(Object.keys(files).length, 8);
  end.writeUInt16LE(Object.keys(files).length, 10);
  end.writeUInt32LE(Buffer.concat(directory).length, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...locals, ...directory, end]);
}

for (const deflate of [false, true]) {
  test(`zipDigests reads ${deflate ? "deflated" : "stored"} files by name`, () => {
    const digests = zipDigests(zip({ "lib/a.dll": "library", "[Content_Types].xml": "<Types/>" }, { deflate }));
    assert.deepEqual([...digests], [["lib/a.dll", digest("library")], ["[Content_Types].xml", digest("<Types/>")]]);
  });
}

test("zipDigests refuses a file that is no ZIP archive", () => {
  assert.throws(() => zipDigests(Buffer.from("plain text")), /The file is not a ZIP archive\./u);
});

const NUGET = "https://api.nuget.org/v3-flatcontainer/xtwitterscraper";
function csharp(published) {
  const released = zip({ "lib/a.dll": "library", "XTwitterScraper.nuspec": "spec" }, { deflate: true });
  return {
    ...github("x-twitter-scraper-csharp", { assets: [asset("XTwitterScraper.1.2.3.nupkg", released)] }),
    [`${NUGET}/index.json`]: { versions: ["1.2.2", "1.2.3"] },
    [`${NUGET}/1.2.3/xtwitterscraper.1.2.3.nupkg`]: published,
    "https://downloads.test/XTwitterScraper.1.2.3.nupkg": released,
  };
}

test("a NuGet package with the release asset's files plus NuGet's signature passes", async () => {
  const published = zip({ "lib/a.dll": "library", "XTwitterScraper.nuspec": "spec", ".signature.p7s": "nuget signature" });
  assert.match(await verifyProject(project("x-twitter-scraper-csharp"), fakeIo(csharp(published))), /has 4 kinds of evidence/u);
});

for (const [name, files] of [
  ["a changed file", { "lib/a.dll": "another library", "XTwitterScraper.nuspec": "spec", ".signature.p7s": "s" }],
  ["an added file", { "lib/a.dll": "library", "XTwitterScraper.nuspec": "spec", "lib/b.dll": "extra", ".signature.p7s": "s" }],
  ["a missing file", { "lib/a.dll": "library", ".signature.p7s": "s" }],
]) {
  test(`a NuGet package with ${name} fails`, async () => {
    assert.equal(
      await failure("x-twitter-scraper-csharp", csharp(zip(files))),
      'x-twitter-scraper-csharp v1.2.3 lacks "NuGet package holds the files of the release asset". the NuGet package and XTwitterScraper.1.2.3.nupkg hold different files.',
    );
  });
}

const MODULE = "github.com/Xquik-dev/x-twitter-scraper-go";
const PROXY = "https://proxy.golang.org/github.com/!xquik-dev/x-twitter-scraper-go/@latest";
const SUMDB = "https://sum.golang.org/lookup/github.com/!xquik-dev/x-twitter-scraper-go@v1.2.3";
const go = (hash, record) => ({
  ...github("x-twitter-scraper-go"),
  [PROXY]: { Origin: { Hash: hash }, Version: "v1.2.3" },
  [SUMDB]: record,
});

test("a Go module built from the tag commit with a checksum database entry passes", async () => {
  const responses = go(COMMIT, `1\n${MODULE} v1.2.3 h1:abc=\n${MODULE} v1.2.3/go.mod h1:def=\n`);
  assert.match(await verifyProject(project("x-twitter-scraper-go"), fakeIo(responses)), /has 3 kinds of evidence/u);
});

for (const [name, responses, message] of [
  ["a Go module built from another commit", go("2222222222222222222222222222222222222222", `${MODULE} v1.2.3 h1:abc=\n`), "the Go proxy built the module from another commit than the tag."],
  ["a Go module with no checksum database entry", go(COMMIT, `${MODULE} v1.2.2 h1:abc=\n`), "the Go checksum database has no entry for the latest version."],
]) {
  test(`${name} fails`, async () => {
    assert.equal(await failure("x-twitter-scraper-go", responses), `x-twitter-scraper-go v1.2.3 lacks "Go checksum database entry and source commit". ${message}`);
  });
}

const packagist = (reference) => ({
  ...github("x-twitter-scraper-php"),
  "https://repo.packagist.org/p2/xquik/x-twitter-scraper.json": {
    packages: { "xquik/x-twitter-scraper": [{ source: { reference }, version: "v1.2.3" }] },
  },
});

test("a Packagist version that points at the tag commit passes", async () => {
  assert.match(await verifyProject(project("x-twitter-scraper-php"), fakeIo(packagist(COMMIT))), /has 3 kinds of evidence/u);
});

test("a Packagist version that points at another commit fails", async () => {
  assert.equal(
    await failure("x-twitter-scraper-php", packagist("2222222222222222222222222222222222222222")),
    'x-twitter-scraper-php v1.2.3 lacks "Packagist source commit equals the tag". Packagist serves another commit than the tag.',
  );
});

test("RELEASES.md shows the evidence table of all 17 projects and no workflow provenance", () => {
  const table = renderEvidenceTable();
  assert.equal(PROJECTS.length, 17);
  assert.equal(table.split("\n").length, 19);
  assert.ok(PROJECTS.every(({ evidence }) => evidence.every((kind) => kind in EVIDENCE)));
  assert.equal(guideProblem(readFileSync(join(root, "RELEASES.md"), "utf8")), undefined);
});

test("a guide without the current evidence table is refused", () => {
  const stale = renderEvidenceTable().replace("npm registry signature", "SLSA provenance");
  assert.equal(
    guideProblem(`# Guide\n\n${stale}\n`),
    "RELEASES.md does not show the current evidence table. Paste the output of --table into it.",
  );
});

for (const [command, pattern] of [
  ["gh attestation verify a.zip --repo Xquik-dev/a --signer-workflow Xquik-dev/a/.github/workflows/b.yml", "--signer-workflow"],
  ["uvx --from pypi-attestations pypi-attestations verify pypi WHEEL_URL", "pypi-attestations verify"],
  ["gem exec sigstore-cli:0.2.3 verify --bundle=b.json a.gem", "sigstore-cli"],
  ["cosign verify-blob --certificate-identity=https://github.com/Xquik-dev/a a.zip", "--certificate-identity"],
]) {
  test(`a guide that shows ${pattern} is refused`, () => {
    assert.equal(
      guideProblem(`${renderEvidenceTable()}\n\n${command}\n`),
      `RELEASES.md shows a command that needs workflow provenance, ${pattern}. Remove it.`,
    );
  });
}

for (const [url, sent] of [
  ["https://api.github.com/repos/Xquik-dev/tweetclaw/releases/latest", true],
  ["https://api.github.com.example.test/repos", false],
  ["https://github.com/Xquik-dev/tweetclaw/releases/download/v1/a.tgz", false],
  ["https://registry.npmjs.org/x-developer/latest", false],
  ["https://pypi.org/pypi/hermes-tweet/json", false],
]) {
  test(`the GitHub token is ${sent ? "sent" : "not sent"} to ${new URL(url).host}`, () => {
    assert.equal("authorization" in requestHeaders(url, "secret-token"), sent);
    assert.equal("authorization" in requestHeaders(url, undefined), false);
  });
}
