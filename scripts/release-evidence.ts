// Copyright the Xquik contributors.
// SPDX-License-Identifier: MIT

// What the latest release of each project provides, and the functions that
// verify it. RELEASES.md shows the table that renderEvidenceTable builds from
// PROJECTS, so the document can promise only what verifyProject checks.

import { createHash, createPublicKey, verify as verifySignature } from "node:crypto";
import { inflateRawSync } from "node:zlib";
import { z } from "zod";

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

export type EvidenceKind = keyof typeof EVIDENCE;

type ProjectOf<R extends string> = {
  readonly repo: string;
  readonly registry: R;
  readonly name: string;
  readonly evidence: readonly EvidenceKind[];
};

const npm = (repo: string, name: string, ...more: EvidenceKind[]): ProjectOf<"npm"> => ({
  repo, registry: "npm", name, evidence: ["tag", "version", "npmSignature", ...more],
});
const pypi = (repo: string, name: string, ...more: EvidenceKind[]): ProjectOf<"PyPI"> => ({
  repo, registry: "PyPI", name, evidence: ["tag", "version", ...more],
});
const maven = (repo: string): ProjectOf<"Maven Central"> => ({
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
] as const satisfies readonly ProjectOf<string>[];

export type Registry = (typeof PROJECTS)[number]["registry"];
export type Project = ProjectOf<Registry>;

// What verifyProject reads the network, the disk and gpg with.
// scripts/verify-release-evidence.ts implements it, and the tests fake it.
export type ReleaseIo = {
  readonly bytes: (url: string) => Promise<Buffer>;
  readonly json: (url: string) => Promise<unknown>;
  readonly readFile: (path: string) => Promise<string | Buffer>;
  readonly run: (
    command: string,
    args: readonly string[],
  ) => Promise<{ readonly status: number; readonly stderr: string; readonly stdout: string }>;
  // The fingerprints of the keys that made a valid signature over the data.
  readonly signers: (files: {
    readonly key: string | Buffer;
    readonly signature: Buffer;
    readonly data: Buffer;
  }) => Promise<readonly string[]>;
  readonly text: (url: string) => Promise<string>;
  readonly wait: (milliseconds: number) => Promise<void>;
};

// The parts of the GitHub and registry documents that the checks read.
const Release = z.looseObject({
  tag_name: z.string(),
  assets: z.array(z.looseObject({ name: z.string(), browser_download_url: z.string(), digest: z.string().nullish() })),
});
const Repository = z.looseObject({ default_branch: z.string() });
const Comparison = z.looseObject({ status: z.string() });
const Commit = z.looseObject({ sha: z.string() });
const Version = z.looseObject({ version: z.string() });
const NpmKeys = z.looseObject({ keys: z.array(z.looseObject({ keyid: z.string(), key: z.string() })) });
const NpmDist = z.looseObject({
  integrity: z.string(),
  signatures: z.array(z.looseObject({ keyid: z.string(), sig: z.string() })).optional(),
});
const NpmManifest = z.looseObject({ name: z.string(), version: z.string(), dist: NpmDist.extend({ tarball: z.string() }) });
const PypiProject = z.looseObject({
  info: z.looseObject({ version: z.string() }),
  urls: z.array(z.looseObject({ filename: z.string(), digests: z.looseObject({ sha256: z.string() }) })),
});
const NugetIndex = z.looseObject({ versions: z.array(z.string()) });
const GoModule = z.looseObject({ Version: z.string(), Origin: z.looseObject({ Hash: z.string().optional() }).optional() });
const PackagistVersion = z.looseObject({
  version: z.string(),
  source: z.looseObject({ reference: z.string().optional() }).optional(),
});
const PackagistMetadata = z.looseObject({ packages: z.record(z.string(), z.array(PackagistVersion)) });
const TerraformDownload = z.looseObject({
  signing_keys: z.looseObject({ gpg_public_keys: z.array(z.looseObject({ ascii_armor: z.string() })) }),
});

// The documents that more than 1 check reads are loaders, so each is fetched
// at most once and only when a check needs it.
type Context = {
  readonly api: string;
  readonly io: ReleaseIo;
  readonly project: Project;
  readonly release: z.infer<typeof Release>;
  readonly tag: string;
  readonly version: string;
  readonly manifest: () => Promise<z.infer<typeof NpmManifest>>;
  readonly pypi: () => Promise<z.infer<typeof PypiProject>>;
  readonly module: () => Promise<z.infer<typeof GoModule>>;
  readonly packagist: () => Promise<z.infer<typeof PackagistVersion>>;
  readonly commit: () => Promise<string>;
};

const once = <T>(load: () => Promise<T>) => {
  let value: Promise<T> | undefined;
  return () => (value ??= load());
};

export function renderEvidenceTable(projects: readonly Project[] = PROJECTS) {
  const rows = projects.map(
    ({ repo, registry, name, evidence }) =>
      `| \`${repo}\` | ${registry} \`${name}\` | ${evidence.map((kind) => EVIDENCE[kind]).join(". ")} |`,
  );
  return ["| Project | Distribution | Evidence of every release |", "| --- | --- | --- |", ...rows].join("\n");
}

// Commands that verify a workflow identity. A release from a maintainer's machine has none.
const WORKFLOW_PROVENANCE = [/--signer-workflow/u, /--certificate-identity/u, /pypi-attestations verify/u, /sigstore-cli/u];

// Why the guide may not be published as it is, or nothing when it is fine.
export function guideProblem(guide: string, projects: readonly Project[] = PROJECTS) {
  if (!guide.includes(renderEvidenceTable(projects))) {
    return "RELEASES.md does not show the current evidence table. Paste the output of --table into it.";
  }
  const promised = WORKFLOW_PROVENANCE.find((pattern) => pattern.test(guide));
  return promised ? `RELEASES.md shows a command that needs workflow provenance, ${promised.source}. Remove it.` : undefined;
}

// The token goes to the GitHub API only, never to a registry or a download host.
export function requestHeaders(url: string, token: string | undefined) {
  const headers: Record<string, string> = { "user-agent": "xquik-release-evidence-check" };
  if (token && url.startsWith(`${GITHUB_API}/`)) headers.authorization = `Bearer ${token}`;
  return headers;
}

export function sha256(bytes: Buffer) {
  return createHash("sha256").update(bytes).digest("hex");
}

// True when an npm registry key signed this exact name, version and integrity.
export function hasValidNpmSignature(
  manifest: { readonly name: string; readonly version: string; readonly dist: z.infer<typeof NpmDist> },
  keys: readonly z.infer<typeof NpmKeys>["keys"][number][],
) {
  const message = Buffer.from(`${manifest.name}@${manifest.version}:${manifest.dist.integrity}`);
  return (manifest.dist.signatures ?? []).some(({ keyid, sig }) => {
    const registryKey = keys.find((candidate) => candidate.keyid === keyid);
    if (!registryKey) return false;
    const publicKey = createPublicKey({ key: Buffer.from(registryKey.key, "base64"), format: "der", type: "spki" });
    return verifySignature("sha256", message, publicKey, Buffer.from(sig, "base64"));
  });
}

// The SHA-256 digest of every file in a ZIP archive, by file name.
export function zipDigests(archive: Buffer) {
  const end = archive.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
  if (end < 0) throw new Error("The file is not a ZIP archive.");
  const digests = new Map<string, string>();
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
export async function compareChecksums(context: Context, text: string, mustList: (name: string) => boolean) {
  const listed = new Map(
    text.split("\n").filter(Boolean).map((line) => {
      const [name = "", digest] = line.trim().split(/\s+/u).reverse();
      return [name, digest] as const;
    }),
  );
  if (listed.size === 0) throw new Error("the checksum file is empty");
  for (const [name, digest] of listed) {
    if ((await assetDigest(context, name)) !== digest) throw new Error(`the checksum of ${name} differs from the release asset`);
  }
  for (const { name } of context.release.assets) {
    if (mustList(name) && !listed.has(name)) throw new Error(`the checksum file does not list ${name}`);
  }
}

function asset({ release }: Context, name: string) {
  const found = release.assets.find((candidate) => candidate.name === name);
  if (!found) throw new Error(`release ${release.tag_name} has no asset ${name}`);
  return found;
}

async function assetDigest(context: Context, name: string) {
  const found = asset(context, name);
  if (found.digest?.startsWith("sha256:")) return found.digest.slice("sha256:".length);
  return sha256(await context.io.bytes(found.browser_download_url));
}

const goPath = (module: string) => module.replaceAll(/[A-Z]/gu, (letter) => `!${letter.toLowerCase()}`);

// Reads the latest version that each registry serves.
const REGISTRY: Record<Registry, (context: Context) => Promise<string | undefined>> = {
  async npm(context) {
    return (await context.manifest()).version;
  },
  async PyPI(context) {
    return (await context.pypi()).info.version;
  },
  async RubyGems({ io, project }) {
    return Version.parse(await io.json(`https://rubygems.org/api/v1/versions/${project.name}/latest.json`)).version;
  },
  async "Maven Central"({ io, project }) {
    const metadata = await io.text(`${MAVEN}/${project.repo}/maven-metadata.xml`);
    return /<release>([^<]+)<\/release>/u.exec(metadata)?.[1];
  },
  async NuGet({ io, project }) {
    return NugetIndex.parse(await io.json(`${NUGET}/${project.name.toLowerCase()}/index.json`)).versions.at(-1);
  },
  async "Go modules"(context) {
    return (await context.module()).Version.replace(/^v/u, "");
  },
  async Packagist(context) {
    return (await context.packagist()).version.replace(/^v/u, "");
  },
  async "Terraform Registry"({ io, project }) {
    return Version.parse(await io.json(`https://registry.terraform.io/v1/providers/${project.name}`)).version;
  },
  // The latest release is the distribution, so its version is the tag.
  async "GitHub Releases"(context) {
    return context.version;
  },
};

const CHECKS: Record<EvidenceKind, (context: Context) => Promise<void>> = {
  async tag(context) {
    const { default_branch: branch } = Repository.parse(await context.io.json(context.api));
    const { status } = Comparison.parse(await context.io.json(`${context.api}/compare/${branch}...${context.tag}`));
    if (status !== "behind" && status !== "identical") throw new Error(`tag ${context.tag} is not on ${branch}`);
  },
  async version(context) {
    const latest = await REGISTRY[context.project.registry](context);
    if (latest !== context.version) {
      throw new Error(`${context.project.registry} has ${latest}, and the latest release tag is ${context.tag}`);
    }
  },
  async npmSignature(context) {
    const { keys } = NpmKeys.parse(await context.io.json("https://registry.npmjs.org/-/npm/v1/keys"));
    if (!hasValidNpmSignature(await context.manifest(), keys)) throw new Error("no npm registry key signed the latest version");
  },
  async npmAsset(context) {
    const name = `${context.project.name.split("/").at(-1)}-${context.version}.tgz`;
    const tarball = sha256(await context.io.bytes((await context.manifest()).dist.tarball));
    if (tarball !== (await assetDigest(context, name))) throw new Error(`${name} differs from the npm tarball`);
  },
  async pypiAssets(context) {
    const { urls } = await context.pypi();
    if (urls.length === 0) throw new Error("PyPI lists no file for the latest version");
    for (const { filename, digests } of urls) {
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
    const download = TerraformDownload.parse(
      await context.io.json(
        `https://registry.terraform.io/v1/providers/${context.project.name}/${context.version}/download/linux/amd64`,
      ),
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
    if ((await context.module()).Origin?.Hash !== (await context.commit())) {
      throw new Error("the Go proxy built the module from another commit than the tag");
    }
    const record = await context.io.text(`https://sum.golang.org/lookup/${goPath(context.project.name)}@${context.tag}`);
    if (!record.includes(`${context.project.name} ${context.tag} h1:`)) {
      throw new Error("the Go checksum database has no entry for the latest version");
    }
  },
  async packagistSource(context) {
    if ((await context.packagist()).source?.reference !== (await context.commit())) {
      throw new Error("Packagist serves another commit than the tag");
    }
  },
  // GitHub's attestation service fails now and then, so 1 failure is tried again.
  async attestation(context) {
    const args = ["release", "verify", context.tag, "--repo", `${ORG}/${context.project.repo}`];
    let reason = "";
    for (let attempt = 1; attempt <= ATTESTATION_ATTEMPTS; attempt += 1) {
      if (attempt > 1) await context.io.wait(ATTESTATION_RETRY_MS);
      const result = await context.io.run("gh", args);
      if (result.status === 0) return;
      reason = result.stderr.trim().split("\n").at(-1) ?? "";
    }
    throw new Error(`gh release verify ${context.tag} failed ${ATTESTATION_ATTEMPTS} times. ${reason}`.trim().replace(/\.$/u, ""));
  },
};

// Reads the latest release of 1 project and creates the loaders its checks share.
async function releaseContext(project: Project, io: ReleaseIo): Promise<Context> {
  const api = `${GITHUB_API}/repos/${ORG}/${project.repo}`;
  const release = Release.parse(await io.json(`${api}/releases/latest`));
  const tag = release.tag_name;
  return {
    api,
    io,
    project,
    release,
    tag,
    version: tag.replace(/^v/u, ""),
    manifest: once(async () =>
      NpmManifest.parse(await io.json(`https://registry.npmjs.org/${project.name.replaceAll("/", "%2f")}/latest`)),
    ),
    pypi: once(async () => PypiProject.parse(await io.json(`https://pypi.org/pypi/${project.name}/json`))),
    module: once(async () => GoModule.parse(await io.json(`https://proxy.golang.org/${goPath(project.name)}/@latest`))),
    packagist: once(async () => {
      const { packages } = PackagistMetadata.parse(await io.json(`https://repo.packagist.org/p2/${project.name}.json`));
      const latest = packages[project.name]?.[0];
      if (latest === undefined) throw new Error(`Packagist lists no version of ${project.name}`);
      return latest;
    }),
    commit: once(async () => Commit.parse(await io.json(`${api}/commits/${tag}`)).sha),
  };
}

// Verifies every evidence kind of 1 project and returns what it verified.
export async function verifyProject(project: Project, io: ReleaseIo) {
  const context = await releaseContext(project, io);
  for (const kind of project.evidence) {
    try {
      await CHECKS[kind](context);
    } catch (error) {
      if (!(error instanceof Error)) throw error;
      throw new Error(`${project.repo} ${context.tag} lacks "${EVIDENCE[kind]}". ${error.message}.`);
    }
  }
  return `${project.repo} ${context.tag} has ${project.evidence.length} kinds of evidence.`;
}
