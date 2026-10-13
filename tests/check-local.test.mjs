// Copyright the Xquik contributors.
// SPDX-License-Identifier: MIT

import assert from "node:assert/strict";
import { copyFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { root, run, workspace, writeFakes } from "./helpers.mjs";

const sha = "0123456789abcdef0123456789abcdef01234567";
const statusUrl = `repos/Xquik-dev/.github/statuses/${sha}`;
// A stub check script records its call and fails when CASE names it.
const stubCheck = `#!/bin/bash
name="\${0##*/}"
if [ "\${1:-}" = --version ]; then [ "$CASE" != no-codeql ] || exit 1; echo 2.27.2; exit; fi
printf '%s token=%s\\n' "$name" "\${GITHUB_TOKEN:-none}" >> "$FAKE_CALLS"
[ "$CASE" != changed ] || touch "$DIRTY"
[ "$CASE" != "$name" ]
`;
const fakes = {
  gpg: "exit 0",
  git: `case "$*" in
  "rev-parse HEAD") echo ${sha} ;;
  "status --porcelain") if [ "$CASE" = dirty ] || [ -e "$DIRTY" ]; then echo ' M README.md'; fi ;;
  *) exit 99 ;;
esac`,
  gh: `case "$1 $2" in
  "auth token") [ "$CASE" != signed-out ] || exit 1; echo secret-token ;;
  "api --silent") [ "$CASE" != unpushed ] || [ "$3" != repos/Xquik-dev/.github/commits/${sha} ] ;;
  *) exit 99 ;;
esac`,
  node: `case "$1" in
  --version) echo "\${NODE_VERSION:-v26.9.0}" ;;
  *)
    printf 'token %s %s\\n' "\${@: -1}" "\${GITHUB_TOKEN:-none}" >> "$FAKE_CALLS"
    [ "$CASE" != "\${@: -1}" ]
    ;;
esac`,
};
const contract = "node scripts/check-public-contract.mjs";
const review = "node scripts/check-review-evidence.mjs";
const checks = [
  "node --test tests/example.test.mjs",
  contract,
  review,
  "node scripts/verify-release-evidence.mjs",
  "codeql-security token=none",
];
const pending = "state=pending Running script tests, contract, review & release evidence & CodeQL.";
const passed =
  "script tests, public contract, review evidence, release evidence, CodeQL 2.27.2.";

function runChecks(t, testCase, args = [], env = {}) {
  const folder = workspace(t);
  const project = join(folder, "project");
  for (const directory of ["bin", "scripts", "tests"]) {
    mkdirSync(join(project, directory), { recursive: true });
  }
  copyFileSync(join(root, "bin/check-local"), join(project, "bin/check-local"));
  writeFileSync(join(project, "tests/example.test.mjs"), "");
  writeFileSync(join(project, "scripts/codeql-security"), stubCheck, { mode: 0o755 });
  writeFakes(folder, fakes);
  const result = run(folder, ["/bin/bash", join(project, "bin/check-local"), ...args], {
    CASE: testCase,
    DIRTY: join(folder, "dirty"),
    ...env,
  });
  const statuses = result.calls
    .filter((call) => call.startsWith(`gh api --silent ${statusUrl} `))
    .map((call) => call.slice(`gh api --silent ${statusUrl} -f `.length))
    .map((call) => call.replace(" -f context=xquik-local-checks -f description=", " "));
  const ran = result.calls.filter(
    (call) => !/^(git |gh |node --version|token )/u.test(call),
  );
  return { ...result, ran, statuses };
}

test("success posts the checks that passed to the exact head", (t) => {
  const result = runChecks(t, "ready");
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(result.ran, checks);
  assert.deepEqual(result.statuses, [pending, `state=success Passed ${passed}`]);
  assert.equal(result.stdout.trimEnd().split("\n").at(-1), `All local checks passed. They were ${passed}`);
});

test("only the contract, review and release checks receive the GitHub token", (t) => {
  const result = runChecks(t, "ready", ["--no-status"]);
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(
    result.calls.filter((call) => /token[ =]/u.test(call)),
    [
      "token tests/example.test.mjs none",
      "token scripts/check-public-contract.mjs secret-token",
      "token scripts/check-review-evidence.mjs secret-token",
      "token scripts/verify-release-evidence.mjs secret-token",
      "codeql-security token=none",
    ],
  );
});

for (const [testCase, ran, failed] of [
  ["tests/example.test.mjs", 1, "Script tests"],
  ["scripts/check-public-contract.mjs", 2, "Public contract with live discovery, OpenAPI and repository copy"],
  ["scripts/check-review-evidence.mjs", 3, "Review evidence for the public inventory and reviewed pull requests"],
  ["scripts/verify-release-evidence.mjs", 4, "Release evidence of the latest release of all 17 projects"],
  ["codeql-security", 5, "Static analysis with CodeQL 2.27.2 security-extended queries"],
  ["changed", 5, "Final tree check"],
]) {
  test(`a failure at ${failed} posts failure and stops`, (t) => {
    const result = runChecks(t, testCase);
    assert.notEqual(result.status, 0);
    assert.deepEqual(result.ran, checks.slice(0, ran));
    assert.deepEqual(result.statuses, [pending, `state=failure Failed at ${failed}.`]);
  });
}

for (const [testCase, env, failed, message] of [
  ["ready", { NODE_VERSION: "v22.23.0" }, "Node.js version", "Node.js v22.23.0 is older than v22.23.1. Upgrade Node.js, then rerun."],
  ["signed-out", {}, "GitHub sign-in", "gh is signed out. Run gh auth login, then rerun."],
  ["no-codeql", {}, "CodeQL CLI", ""],
]) {
  test(`an unusable setup fails at ${failed} before any check`, (t) => {
    const result = runChecks(t, testCase, [], env);
    assert.equal(result.status, 1);
    assert.deepEqual(result.ran, []);
    assert.deepEqual(result.statuses, [pending, `state=failure Failed at ${failed}.`]);
    assert.equal(result.stderr, message && `check-local: ${message}\n`);
  });
}

for (const [testCase, args, reason] of [
  ["ready", ["--no-status"], "--no-status was passed."],
  ["dirty", [], "the tree has uncommitted changes."],
  ["unpushed", [], "GitHub does not have HEAD, or gh is signed out. Push first."],
]) {
  test(`no status is posted when ${reason}`, (t) => {
    const result = runChecks(t, testCase, args);
    assert.equal(result.status, 0, result.stderr);
    assert.deepEqual(result.ran, checks);
    assert.deepEqual(result.statuses, []);
    assert.equal(result.stdout.split("\n")[0], `==> Commit status not posted because ${reason}`);
  });
}

test("an unknown option stops before any check", (t) => {
  const result = runChecks(t, "ready", ["--skip"]);
  assert.equal(result.status, 2);
  assert.deepEqual(result.calls, []);
  assert.equal(result.stderr, "check-local: unknown option --skip. Use --no-status or no option.\n");
});
