// Copyright the Xquik contributors.
// SPDX-License-Identifier: MIT

import assert from "node:assert/strict";
import { copyFileSync, existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { type TestContext, test } from "node:test";
import { root, run, workspace, writeFakes } from "./helpers.ts";

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
  npm: `printf 'token npm %s %s\\n' "$*" "\${GITHUB_TOKEN:-none}" >> "$FAKE_CALLS"
[ "$CASE" != "$call" ]`,
  node: `case "$1" in
  --version) echo "\${NODE_VERSION:-v26.9.0}" ;;
  *)
    printf 'token %s %s\\n' "\${@: -1}" "\${GITHUB_TOKEN:-none}" >> "$FAKE_CALLS"
    case "$1" in
      scripts/attest-releases.ts) echo '{"writer":true}' ;;
      scripts/verify-release-evidence.ts)
        printf 'evidence %s %s %s\\n' "\${XQUIK_RELEASE_ATTESTATIONS-unset}" "\${XQUIK_RELEASE_ATTESTATIONS_SINCE-unset}" "$(cat "$XQUIK_RELEASE_ATTESTATIONS")" >> "$FAKE_CALLS"
        ;;
    esac
    [ "$CASE" != "\${@: -1}" ]
    ;;
esac`,
};
const install = "npm ci --ignore-scripts --no-audit --no-fund";
const types = "npm run --silent types";
const coverage = "npm run --silent coverage:types";
const lint = "npm run --silent lint";
const contract = "node scripts/check-public-contract.ts";
const review = "node scripts/check-review-evidence.ts";
const attest = "node scripts/attest-releases.ts";
const checks = [
  install,
  types,
  coverage,
  lint,
  "node --test tests/example.test.ts",
  contract,
  review,
  attest,
  "node scripts/verify-release-evidence.ts",
  "codeql-security token=none",
];
const checksWithoutWriter = checks.filter((check) => check !== attest);
const pending =
  "state=pending Running install, types, type coverage, lint, script tests, contract, review & release evidence & CodeQL.";
const passed =
  "install, types, type coverage, lint, script tests, public contract, review evidence, release evidence, CodeQL 2.27.2.";

// Each check with the token it saw, which only the 3 verifiers may get.
function seenTokens(token: string, writer = true) {
  return [
    `token ${install} none`,
    `token ${types} none`,
    `token ${coverage} none`,
    `token ${lint} none`,
    "token tests/example.test.ts none",
    `token scripts/check-public-contract.ts ${token}`,
    `token scripts/check-review-evidence.ts ${token}`,
    ...(writer ? [`token scripts/attest-releases.ts ${token}`] : []),
    `token scripts/verify-release-evidence.ts ${token}`,
    "codeql-security token=none",
  ];
}
const withoutGh = Object.fromEntries(Object.entries(fakes).filter(([name]) => name !== "gh"));

function runChecks(
  t: TestContext,
  testCase: string,
  args: readonly string[] = [],
  env: Readonly<Record<string, string>> = {},
  tools: Readonly<Record<string, string>> = fakes,
) {
  const folder = workspace(t);
  const project = join(folder, "project");
  for (const directory of ["bin", "scripts", "tests"]) {
    mkdirSync(join(project, directory), { recursive: true });
  }
  copyFileSync(join(root, "bin/check-local"), join(project, "bin/check-local"));
  writeFileSync(join(project, "tests/example.test.ts"), "");
  writeFileSync(join(project, "scripts/codeql-security"), stubCheck, { mode: 0o755 });
  writeFakes(folder, tools);
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
    (call) => !/^(git |gh |node --version|token |evidence )/u.test(call),
  );
  const tokens = result.calls.filter((call) => /token[ =]/u.test(call));
  return { ...result, folder, ran, statuses, tokens };
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
  assert.deepEqual(result.tokens, seenTokens("secret-token"));
});

test("with no gh, the token in GITHUB_TOKEN reaches only the 3 verifiers", (t) => {
  const evidence = join(workspace(t), "attestations.json");
  writeFileSync(evidence, '{"from":"a machine with gh"}');
  const env = { GITHUB_TOKEN: "passed-token", XQUIK_RELEASE_ATTESTATIONS: evidence, XQUIK_RELEASE_ATTESTATIONS_SINCE: "1789000000" };
  const result = runChecks(t, "ready", [], env, withoutGh);
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(result.ran, checksWithoutWriter);
  assert.deepEqual(result.tokens, seenTokens("passed-token", false));
  assert.ok(result.calls.includes(`evidence ${evidence} 1789000000 {"from":"a machine with gh"}`));
  assert.equal(existsSync(evidence), true);
  assert.deepEqual(result.statuses, []);
  assert.equal(result.stdout.split("\n")[0], "==> Commit status not posted because the GitHub CLI is not installed.");
});

test("the token in GH_TOKEN replaces the gh login and still posts the status", (t) => {
  const result = runChecks(t, "ready", [], { GH_TOKEN: "passed-token" });
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(result.tokens, seenTokens("passed-token"));
  assert.equal(result.calls.includes("gh auth token"), false);
  assert.deepEqual(result.statuses, [pending, `state=success Passed ${passed}`]);
});

test("with no gh and no token, the run fails at GitHub sign-in before any check", (t) => {
  const result = runChecks(t, "ready", [], {}, withoutGh);
  assert.equal(result.status, 1);
  assert.deepEqual(result.ran, []);
  assert.deepEqual(result.statuses, []);
  assert.equal(
    result.stderr,
    "check-local: gh is missing and GITHUB_TOKEN is unset. Install gh, or pass the token in GITHUB_TOKEN, then rerun.\n",
  );
});

test("bin/check-local writes the evidence file with gh before the release check and removes it after", (t) => {
  const before = Math.floor(Date.now() / 1000);
  const result = runChecks(t, "ready", ["--no-status"]);
  assert.equal(result.status, 0, result.stderr);
  const [line] = result.calls.filter((call) => call.startsWith("evidence "));
  const [, path = "", since = "", ...body] = (line ?? "").split(" ");
  assert.equal(body.join(" "), '{"writer":true}');
  assert.ok(path.startsWith(result.folder), path);
  assert.ok(Number(since) >= before && Number(since) <= Math.floor(Date.now() / 1000), since);
  assert.ok(result.calls.indexOf(attest) < result.calls.indexOf("node scripts/verify-release-evidence.ts"));
  assert.deepEqual(readdirSync(result.folder).filter((name) => name.startsWith("xquik-attestations.")), []);
});

test("with no gh and no evidence file, the run fails at the attestations before any check", (t) => {
  const result = runChecks(t, "ready", [], { GITHUB_TOKEN: "passed-token" }, withoutGh);
  assert.equal(result.status, 1);
  assert.deepEqual(result.ran, []);
  assert.deepEqual(result.statuses, []);
  assert.equal(
    result.stderr,
    "check-local: gh is missing and XQUIK_RELEASE_ATTESTATIONS is unset. Install gh, or pass the file that node scripts/attest-releases.ts wrote on a machine with gh, then rerun.\n",
  );
});

test("a failed writer posts failure, stops before the verifier and leaves no evidence file", (t) => {
  const result = runChecks(t, "scripts/attest-releases.ts");
  assert.notEqual(result.status, 0);
  assert.deepEqual(result.ran, checks.slice(0, 8));
  assert.deepEqual(result.statuses, [pending, "state=failure Failed at Release evidence of the latest release of all 17 projects."]);
  assert.deepEqual(readdirSync(result.folder).filter((name) => name.startsWith("xquik-attestations.")), []);
});

for (const [testCase, ran, failed] of [
  [install, 1, "Install of the pinned dev dependencies from package-lock.json"],
  [types, 2, "Type check of every script and test with tsc"],
  [coverage, 3, "Type coverage of 100% in strict mode"],
  [lint, 4, "Lint with the ESLint type bans"],
  ["tests/example.test.ts", 5, "Script tests"],
  ["scripts/check-public-contract.ts", 6, "Public contract with live discovery, OpenAPI and repository copy"],
  ["scripts/check-review-evidence.ts", 7, "Review evidence for the public inventory and reviewed pull requests"],
  ["scripts/verify-release-evidence.ts", 9, "Release evidence of the latest release of all 17 projects"],
  ["codeql-security", 10, "Static analysis with CodeQL 2.27.2 security-extended queries"],
  ["changed", 10, "Final tree check"],
] as const) {
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
] as const) {
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
] as const) {
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
