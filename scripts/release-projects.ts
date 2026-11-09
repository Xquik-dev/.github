// Copyright the Xquik contributors.
// SPDX-License-Identifier: MIT

// What the latest release of each project provides. It imports nothing, so
// scripts/attest-releases.ts runs where no dependency is installed.

export const ORG = "Xquik-dev";

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
