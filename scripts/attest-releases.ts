// Copyright the Xquik contributors.
// SPDX-License-Identifier: MIT

// Runs gh release verify on the latest release of every project that promises
// a GitHub release attestation, and prints the evidence file that
// scripts/verify-release-evidence.ts reads. It imports no dependency, so a
// machine with gh runs it with no install and hands the file to a runner
// without gh.
// Usage: node scripts/attest-releases.ts > attestations.json

import { execFile } from "node:child_process";
import { setTimeout as wait } from "node:timers/promises";
import { ORG, PROJECTS, type Project } from "./release-projects.ts";

const ATTEMPTS = 3;
// GitHub's attestation service fails now and then, so a failure is tried again.
const retryDelay = Number(process.env.XQUIK_RETRY_MS ?? 2000);
// The repository, the tag and the tag object sha that GitHub signed.
const STATEMENT =
  ".verificationResult.statement | [.predicate.repository, .predicate.tag, (.subject[] | .digest.sha1 // empty)] | @tsv";

type Result = { readonly status: number; readonly stderr: string; readonly stdout: string };

const run = (command: string, args: readonly string[]) =>
  new Promise<Result>((resolve) => {
    execFile(command, args, { encoding: "utf8" }, (error, stdout, stderr) => {
      resolve({ status: error ? (typeof error.code === "number" ? error.code : 1) : 0, stdout, stderr });
    });
  });

async function attest({ repo: name }: Project) {
  const repo = `${ORG}/${name}`;
  let reason = "";
  for (let attempt = 1; attempt <= ATTEMPTS; attempt += 1) {
    if (attempt > 1) await wait(retryDelay);
    const result = await run("gh", ["release", "verify", "--repo", repo, "--format", "json", "--jq", STATEMENT]);
    const [signed, tag, sha, ...rest] = result.stdout.trim().split("\t");
    if (result.status === 0 && signed === repo && tag && sha && rest.length === 0) return { repo, tag, sha };
    reason =
      result.status === 0
        ? `gh printed ${JSON.stringify(result.stdout.trim())}, not the signed repository, tag and tag sha`
        : (result.stderr.trim().split("\n").at(-1) ?? "");
  }
  throw new Error(`gh release verify failed ${ATTEMPTS} times for the latest release of ${repo}. ${reason}`.trim());
}

const head = await run("git", ["rev-parse", "HEAD"]);
if (head.status !== 0) throw new Error(`git rev-parse HEAD failed. ${head.stderr.trim()}`);
const projects: readonly Project[] = PROJECTS;
const results = await Promise.all(
  projects
    .filter(({ evidence }) => evidence.includes("attestation"))
    .map((project) =>
      attest(project).then(
        (release) => ({ release, failure: "" }),
        (error: unknown) => ({ release: undefined, failure: error instanceof Error ? error.message : String(error) }),
      ),
    ),
);
const releases = results.flatMap(({ release }) => (release === undefined ? [] : [release]));
for (const { failure } of results) {
  if (failure !== "") process.stderr.write(`${failure}\n`);
}
if (releases.length === results.length) {
  const evidence = { commit: head.stdout.trim(), verifiedAt: new Date().toISOString(), releases };
  process.stdout.write(`${JSON.stringify(evidence)}\n`);
} else {
  process.exitCode = 1;
}
