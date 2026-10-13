// Copyright the Xquik contributors.
// SPDX-License-Identifier: MIT

// What the latest release of each project provides, and the functions that
// verify it. RELEASES.md shows the table that renderEvidenceTable builds from
// PROJECTS, so the document can promise only what verifyProject checks.

import { createHash, createPublicKey, verify as verifySignature } from "node:crypto";
import { inflateRawSync } from "node:zlib";

export const ORG = "Xquik-dev";
export const GITHUB_API = "https://api.github.com";
export const MAVEN_KEY = "6965E561C0ACEE32060AB961D2037E4157E62A59";
export const MAVEN_KEY_FILE = "keys/xquik-maven-central.asc";
export const TERRAFORM_KEY = "0DC478C17474B9645C25B46C4900C25E85324F28";
const MAVEN = "https://repo1.maven.org/maven2/com/xquik/api";
const NUGET = "https://api.nuget.org/v3-flatcontainer";
const NUGET_SIGNATURE = ".signature.p7s";
const ATTESTATION_ATTEMPTS = 3;
const ATTESTATION_RETRY_MS = 2000;

export const EVIDENCE = {
  tag: "Release tag on the default branch",
  version: "Registry version equals the tag",
  npmSignature: "npm registry signature",
  npmAsset: "Release asset equals the npm tarball",
  pypiAssets: "Release assets equal the PyPI files",
  mavenSignature: "OpenPGP signature from the Xquik Maven key",
  terraformChecksums: "Checksums signed by the Xquik Terraform key",
  checksums: "Checksum file matches the release assets",
  nugetContent: "NuGet package holds the files of the release asset",
  goSource: "Go checksum database entry and source commit",
  packagistSource: "Packagist source commit equals the tag",
  attestation: "GitHub release attestation",
};

const npm = (repo, name, ...more) => ({
  repo, registry: "npm", name, evidence: ["tag", "version", "npmSignature", ...more],
});
const pypi = (repo, name, ...more) => ({
  repo, registry: "PyPI", name, evidence: ["tag", "version", ...more],
});
const maven = (repo) => ({
  repo, registry: "Maven Central", name: `com.xquik.api:${repo}`,
  evidence: ["tag", "version", "mavenSignature"],
});

export const PROJECTS = [
  pypi("hermes-tweet", "hermes-tweet", "pypiAssets"),
  npm("n8n-nodes-xquik", "n8n-nodes-xquik"),
  npm("paperclip-plugin-xquik", "@xquik/paperclip-plugin-xquik"),
  pypi("prefect-xquik", "prefect-xquik"),
  {
    repo: "terraform-provider-x-twitter-scraper", registry: "Terraform Registry",
    name: "Xquik-dev/x-twitter-scraper",
    evidence: ["tag", "version", "terraformChecksums", "attestation"],
  },
  npm("tweetclaw", "@xquik/tweetclaw"),
  npm("x-twitter-scraper", "x-developer"),
  { repo: "x-twitter-scraper-cli", registry: "GitHub Releases", name: "x-twitter-scraper", evidence: ["tag", "checksums"] },
  {
    repo: "x-twitter-scraper-csharp", registry: "NuGet", name: "XTwitterScraper",
    evidence: ["tag", "version", "nugetContent", "attestation"],
  },
  {
    repo: "x-twitter-scraper-go", registry: "Go modules",
    name: "github.com/Xquik-dev/x-twitter-scraper-go", evidence: ["tag", "version", "goSource"],
  },
  maven("x-twitter-scraper-java"),
  maven("x-twitter-scraper-kotlin"),
  {
    repo: "x-twitter-scraper-php", registry: "Packagist", name: "xquik/x-twitter-scraper",
    evidence: ["tag", "version", "packagistSource"],
  },
  pypi("x-twitter-scraper-python", "x-twitter-scraper", "attestation"),
  { repo: "x-twitter-scraper-ruby", registry: "RubyGems", name: "x-twitter-scraper", evidence: ["tag", "version", "attestation"] },
  npm("x-twitter-scraper-typescript", "x-twitter-scraper", "npmAsset", "attestation"),
  pypi("xquik-haystack", "xquik-haystack"),
];

export function renderEvidenceTable(projects = PROJECTS) {
  const rows = projects.map(
    ({ repo, registry, name, evidence }) =>
      `| \`${repo}\` | ${registry} \`${name}\` | ${evidence.map((kind) => EVIDENCE[kind]).join(". ")} |`,
  );
  return ["| Project | Distribution | Evidence of every release |", "| --- | --- | --- |", ...rows].join("\n");
}

// Commands that verify a workflow identity. A release from a maintainer's machine has none.
const WORKFLOW_PROVENANCE = [/--signer-workflow/u, /--certificate-identity/u, /pypi-attestations verify/u, /sigstore-cli/u];

// Why the guide may not be published as it is, or nothing when it is fine.
export function guideProblem(guide, projects = PROJECTS) {
  if (!guide.includes(renderEvidenceTable(projects))) {
    return "RELEASES.md does not show the current evidence table. Paste the output of --table into it.";
  }
  const promised = WORKFLOW_PROVENANCE.find((pattern) => pattern.test(guide));
  return promised ? `RELEASES.md shows a command that needs workflow provenance, ${promised.source}. Remove it.` : undefined;
}

// The token goes to the GitHub API only, never to a registry or a download host.
export function requestHeaders(url, token) {
  const headers = { "user-agent": "xquik-release-evidence-check" };
  if (token && url.startsWith(`${GITHUB_API}/`)) headers.authorization = `Bearer ${token}`;
  return headers;
}

export function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

// True when an npm registry key signed this exact name, version and integrity.
export function hasValidNpmSignature(manifest, keys) {
  const message = Buffer.from(`${manifest.name}@${manifest.version}:${manifest.dist?.integrity}`);
  return (manifest.dist?.signatures ?? []).some(({ keyid, sig }) => {
    const registryKey = keys.find((candidate) => candidate.keyid === keyid);
    if (!registryKey) return false;
    const publicKey = createPublicKey({ key: Buffer.from(registryKey.key, "base64"), format: "der", type: "spki" });
    return verifySignature("sha256", message, publicKey, Buffer.from(sig, "base64"));
  });
}

// The SHA-256 digest of every file in a ZIP archive, by file name.
export function zipDigests(archive) {
  const end = archive.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
  if (end < 0) throw new Error("The file is not a ZIP archive.");
  const digests = new Map();
  let offset = archive.readUInt32LE(end + 16);
  for (let entry = archive.readUInt16LE(end + 10); entry > 0; entry -= 1) {
    if (archive.readUInt32LE(offset) !== 0x02014b50) throw new Error("The ZIP directory is damaged.");
    const method = archive.readUInt16LE(offset + 10);
    const nameLength = archive.readUInt16LE(offset + 28);
    const local = archive.readUInt32LE(offset + 42);
    const start = local + 30 + archive.readUInt16LE(local + 26) + archive.readUInt16LE(local + 28);
    const stored = archive.subarray(start, start + archive.readUInt32LE(offset + 20));
    if (method !== 0 && method !== 8) throw new Error(`ZIP method ${method} is not supported.`);
    const name = archive.toString("utf8", offset + 46, offset + 46 + nameLength);
    digests.set(name, sha256(method === 8 ? inflateRawSync(stored) : stored));
    offset += 46 + nameLength + archive.readUInt16LE(offset + 30) + archive.readUInt16LE(offset + 32);
  }
  return digests;
}

// Every line of a checksum file must name a release asset with that digest,
// and every asset the file must cover has to be listed.
export async function compareChecksums(context, text, mustList) {
  const listed = new Map(
    text.split("\n").filter(Boolean).map((line) => line.trim().split(/\s+/u).reverse()),
  );
  if (listed.size === 0) throw new Error("the checksum file is empty");
  for (const [name, digest] of listed) {
    if ((await assetDigest(context, name)) !== digest) throw new Error(`the checksum of ${name} differs from the release asset`);
  }
  for (const { name } of context.release.assets) {
    if (mustList(name) && !listed.has(name)) throw new Error(`the checksum file does not list ${name}`);
  }
}

function asset({ release }, name) {
  const found = release.assets.find((candidate) => candidate.name === name);
  if (!found) throw new Error(`release ${release.tag_name} has no asset ${name}`);
  return found;
}

async function assetDigest(context, name) {
  const found = asset(context, name);
  if (found.digest?.startsWith("sha256:")) return found.digest.slice("sha256:".length);
  return sha256(await context.io.bytes(found.browser_download_url));
}

async function tagCommit(context) {
  context.commit ??= (await context.io.json(`${context.api}/commits/${context.tag}`)).sha;
  return context.commit;
}

const goPath = (module) => module.replaceAll(/[A-Z]/gu, (letter) => `!${letter.toLowerCase()}`);

// Reads the registry's latest version once and keeps what later checks need.
const REGISTRY = {
  async npm(context) {
    context.manifest = await context.io.json(`https://registry.npmjs.org/${context.project.name.replaceAll("/", "%2f")}/latest`);
    return context.manifest.version;
  },
  async PyPI(context) {
    context.pypi = await context.io.json(`https://pypi.org/pypi/${context.project.name}/json`);
    return context.pypi.info.version;
  },
  async RubyGems({ io, project }) {
    return (await io.json(`https://rubygems.org/api/v1/versions/${project.name}/latest.json`)).version;
  },
  async "Maven Central"({ io, project }) {
    const metadata = await io.text(`${MAVEN}/${project.repo}/maven-metadata.xml`);
    return /<release>([^<]+)<\/release>/u.exec(metadata)?.[1];
  },
  async NuGet({ io, project }) {
    return (await io.json(`${NUGET}/${project.name.toLowerCase()}/index.json`)).versions.at(-1);
  },
  async "Go modules"(context) {
    context.module = await context.io.json(`https://proxy.golang.org/${goPath(context.project.name)}/@latest`);
    return context.module.Version.replace(/^v/u, "");
  },
  async Packagist(context) {
    const metadata = await context.io.json(`https://repo.packagist.org/p2/${context.project.name}.json`);
    [context.packagist] = metadata.packages[context.project.name];
    return context.packagist.version.replace(/^v/u, "");
  },
  async "Terraform Registry"({ io, project }) {
    return (await io.json(`https://registry.terraform.io/v1/providers/${project.name}`)).version;
  },
};

const CHECKS = {
  async tag(context) {
    const { default_branch: branch } = await context.io.json(context.api);
    const { status } = await context.io.json(`${context.api}/compare/${branch}...${context.tag}`);
    if (status !== "behind" && status !== "identical") throw new Error(`tag ${context.tag} is not on ${branch}`);
  },
  async version(context) {
    const latest = await REGISTRY[context.project.registry](context);
    if (latest !== context.version) {
      throw new Error(`${context.project.registry} has ${latest}, and the latest release tag is ${context.tag}`);
    }
  },
  async npmSignature(context) {
    const { keys } = await context.io.json("https://registry.npmjs.org/-/npm/v1/keys");
    if (!hasValidNpmSignature(context.manifest, keys)) throw new Error("no npm registry key signed the latest version");
  },
  async npmAsset(context) {
    const name = `${context.project.name.split("/").at(-1)}-${context.version}.tgz`;
    const tarball = sha256(await context.io.bytes(context.manifest.dist.tarball));
    if (tarball !== (await assetDigest(context, name))) throw new Error(`${name} differs from the npm tarball`);
  },
  async pypiAssets(context) {
    if (context.pypi.urls.length === 0) throw new Error("PyPI lists no file for the latest version");
    for (const { filename, digests } of context.pypi.urls) {
      if ((await assetDigest(context, filename)) !== digests.sha256) throw new Error(`${filename} differs from the PyPI file`);
    }
  },
  async mavenSignature(context) {
    const jar = `${MAVEN}/${context.project.repo}/${context.version}/${context.project.repo}-${context.version}.jar`;
    const signers = await context.io.signers({
      key: await context.io.readFile(MAVEN_KEY_FILE),
      signature: await context.io.bytes(`${jar}.asc`),
      data: await context.io.bytes(jar),
    });
    if (!signers.includes(MAVEN_KEY)) throw new Error("the Xquik Maven key did not sign the latest JAR");
  },
  async terraformChecksums(context) {
    const sums = `${context.project.repo}_${context.version}_SHA256SUMS`;
    const download = await context.io.json(
      `https://registry.terraform.io/v1/providers/${context.project.name}/${context.version}/download/linux/amd64`,
    );
    const data = await context.io.bytes(asset(context, sums).browser_download_url);
    const signers = await context.io.signers({
      key: download.signing_keys.gpg_public_keys.map((key) => key.ascii_armor).join("\n"),
      signature: await context.io.bytes(asset(context, `${sums}.sig`).browser_download_url),
      data,
    });
    if (!signers.includes(TERRAFORM_KEY)) throw new Error("the Xquik Terraform key did not sign the checksum file");
    await compareChecksums(context, data.toString(), (name) => name.endsWith(".zip"));
  },
  async checksums(context) {
    const name = `${context.project.name}_${context.version}_checksums.txt`;
    const data = await context.io.bytes(asset(context, name).browser_download_url);
    await compareChecksums(context, data.toString(), () => false);
  },
  async nugetContent(context) {
    const id = context.project.name.toLowerCase();
    const name = `${context.project.name}.${context.version}.nupkg`;
    const released = zipDigests(await context.io.bytes(asset(context, name).browser_download_url));
    const published = zipDigests(await context.io.bytes(`${NUGET}/${id}/${context.version}/${id}.${context.version}.nupkg`));
    published.delete(NUGET_SIGNATURE);
    const same =
      released.size === published.size && [...released].every(([file, digest]) => published.get(file) === digest);
    if (!same) throw new Error(`the NuGet package and ${name} hold different files`);
  },
  async goSource(context) {
    if (context.module.Origin?.Hash !== (await tagCommit(context))) {
      throw new Error("the Go proxy built the module from another commit than the tag");
    }
    const record = await context.io.text(`https://sum.golang.org/lookup/${goPath(context.project.name)}@${context.tag}`);
    if (!record.includes(`${context.project.name} ${context.tag} h1:`)) {
      throw new Error("the Go checksum database has no entry for the latest version");
    }
  },
  async packagistSource(context) {
    if (context.packagist.source?.reference !== (await tagCommit(context))) {
      throw new Error("Packagist serves another commit than the tag");
    }
  },
  // GitHub's attestation service fails now and then, so 1 failure is tried again.
  async attestation(context) {
    const args = ["release", "verify", context.tag, "--repo", `${ORG}/${context.project.repo}`];
    let result;
    for (let attempt = 1; attempt <= ATTESTATION_ATTEMPTS; attempt += 1) {
      if (attempt > 1) await context.io.wait(ATTESTATION_RETRY_MS);
      result = await context.io.run("gh", args);
      if (result.status === 0) return;
    }
    const reason = result.stderr.trim().split("\n").at(-1) ?? "";
    throw new Error(`gh release verify ${context.tag} failed ${ATTESTATION_ATTEMPTS} times. ${reason}`.trim().replace(/\.$/u, ""));
  },
};

// Verifies every evidence kind of 1 project and returns what it verified.
export async function verifyProject(project, io) {
  const api = `${GITHUB_API}/repos/${ORG}/${project.repo}`;
  const release = await io.json(`${api}/releases/latest`);
  const context = { api, io, project, release, tag: release.tag_name, version: release.tag_name.replace(/^v/u, "") };
  for (const kind of project.evidence) {
    try {
      await CHECKS[kind](context);
    } catch (error) {
      throw new Error(`${project.repo} ${context.tag} lacks "${EVIDENCE[kind]}". ${error.message}.`);
    }
  }
  return `${project.repo} ${context.tag} has ${project.evidence.length} kinds of evidence.`;
}
