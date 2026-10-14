// Copyright the Xquik contributors.
// SPDX-License-Identifier: MIT

import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as wait } from "node:timers/promises";
import { PROJECTS, guideProblem, renderEvidenceTable, requestHeaders, verifyProject } from "./release-evidence.mjs";

const ATTEMPTS = 3;
const retryDelay = Number(process.env.XQUIK_RETRY_MS ?? 1500);

async function request(url) {
  const headers = requestHeaders(url, process.env.GITHUB_TOKEN);
  for (let attempt = 1; ; attempt += 1) {
    const response = await fetch(url, { headers }).catch((error) => error);
    if (response instanceof Response && response.ok) return Buffer.from(await response.arrayBuffer());
    const retriable = !(response instanceof Response) || response.status === 429 || response.status >= 500;
    if (attempt === ATTEMPTS || !retriable) {
      throw new Error(`${url} ${response instanceof Response ? `returned HTTP ${response.status}` : "could not be reached"}`);
    }
    await wait(retryDelay * attempt);
  }
}

function run(command, args) {
  return new Promise((resolve) => {
    execFile(command, args, { encoding: "utf8" }, (error, stdout, stderr) => {
      resolve({ status: error ? (typeof error.code === "number" ? error.code : 1) : 0, stdout, stderr });
    });
  });
}

async function signers({ key, signature, data }) {
  const home = await mkdtemp(join(tmpdir(), "release-evidence-gpg-"));
  try {
    await Promise.all([
      writeFile(join(home, "key.asc"), key),
      writeFile(join(home, "data.sig"), signature),
      writeFile(join(home, "data"), data),
    ]);
    const gpg = ["--homedir", home, "--batch", "--no-autostart", "--quiet"];
    const imported = await run("gpg", [...gpg, "--import", join(home, "key.asc")]);
    if (imported.status !== 0) throw new Error("gpg could not import the public key");
    const verified = await run("gpg", [...gpg, "--status-fd", "1", "--verify", join(home, "data.sig"), join(home, "data")]);
    return verified.stdout
      .split("\n")
      .filter((line) => line.startsWith("[GNUPG:] VALIDSIG "))
      .flatMap((line) => [line.split(" ")[2], line.split(" ").at(-1)]);
  } finally {
    await rm(home, { force: true, recursive: true });
  }
}

const io = {
  bytes: request,
  json: async (url) => JSON.parse((await request(url)).toString()),
  readFile,
  run,
  signers,
  text: async (url) => (await request(url)).toString(),
  wait,
};

if (process.argv.includes("--table")) {
  process.stdout.write(`${renderEvidenceTable()}\n`);
} else {
  const problem = guideProblem(await readFile("RELEASES.md", "utf8"));
  if (problem) throw new Error(problem);
  const results = await Promise.allSettled(PROJECTS.map((project) => verifyProject(project, io)));
  for (const result of results) {
    if (result.status === "fulfilled") process.stdout.write(`${result.value}\n`);
    else process.stderr.write(`${result.reason.message}\n`);
  }
  const failed = results.filter((result) => result.status === "rejected").length;
  if (failed > 0) {
    process.stderr.write(`Release evidence is missing for ${failed} of ${PROJECTS.length} projects.\n`);
    process.exitCode = 1;
  } else {
    process.stdout.write(`Release evidence verified for ${PROJECTS.length} projects.\n`);
  }
}
