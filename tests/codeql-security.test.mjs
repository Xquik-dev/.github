// Copyright the Xquik contributors.
// SPDX-License-Identifier: MIT

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { root, run, workspace, writeFakes } from "./helpers.mjs";

const script = join(root, "scripts/codeql-security");
const verifier = join(root, "scripts/verify-codeql.mjs");
const extracted = {
  descriptor: { id: "js/diagnostics/successfully-extracted-files" },
  level: "none",
};

function report(change = {}) {
  const run = {
    invocations: [{ executionSuccessful: true, toolExecutionNotifications: [extracted] }],
    results: [],
    ...change,
  };
  return { runs: [run], version: "2.1.0" };
}

const exception = {
  file: "scripts/a.mjs",
  message: "Unsafe value.",
  reason: "Reviewed.",
  recheck: "2026-12-31",
  rule: "js/example",
};

function verify(t, sarif, exceptions = [], today = "2026-10-13") {
  const folder = workspace(t);
  writeFileSync(join(folder, "report.sarif"), JSON.stringify(sarif));
  writeFileSync(join(folder, "exceptions.json"), JSON.stringify(exceptions));
  return spawnSync(
    process.execPath,
    [verifier, join(folder, "report.sarif"), join(folder, "exceptions.json"), today],
    { encoding: "utf8" },
  );
}

function result(level, change = {}) {
  return {
    level,
    locations: [{ physicalLocation: { artifactLocation: { uri: "scripts/a.mjs" }, region: { startLine: 7 } } }],
    message: { text: "Unsafe value." },
    ruleId: "js/example",
    ...change,
  };
}

test("a complete run with no results passes", (t) => {
  const outcome = verify(t, report());
  assert.equal(outcome.status, 0, outcome.stderr);
  assert.equal(
    outcome.stdout,
    "CodeQL finished with no unreviewed results. Reviewed exceptions 0. Extracted JavaScript entries 1.\n",
  );
});

for (const level of ["error", "warning", "note", "none", undefined]) {
  test(`a result of level ${level} fails and names its place`, (t) => {
    const outcome = verify(t, report({ results: [result(level)] }));
    assert.equal(outcome.status, 1);
    assert.match(outcome.stderr, /^js\/example scripts\/a\.mjs:7 Unsafe value\.$/mu);
    assert.match(outcome.stderr, /CodeQL found 1 unreviewed result\(s\)\. Fix each one\./u);
  });
}

test("a result that matches a reviewed exception passes on its recheck date", (t) => {
  const outcome = verify(t, report({ results: [result("warning")] }), [exception], "2026-12-31");
  assert.equal(outcome.status, 0, outcome.stderr);
  assert.match(outcome.stdout, /Reviewed exceptions 1\./u);
});

for (const [name, change] of [
  ["another rule", { ruleId: "js/other" }],
  ["another file", { locations: [{ physicalLocation: { artifactLocation: { uri: "scripts/b.mjs" } } }] }],
  ["another message", { message: { text: "Another unsafe value." } }],
]) {
  test(`an exception does not cover ${name}`, (t) => {
    const results = [result("warning"), result("warning", change)];
    const outcome = verify(t, report({ results }), [exception]);
    assert.equal(outcome.status, 1);
    assert.match(outcome.stderr, /CodeQL found 1 unreviewed result\(s\)\. Fix each one\./u);
  });
}

for (const [name, exceptions, results, today, message] of [
  ["is past its recheck date", [exception], [result("warning")], "2027-01-01", "The review of js/example in scripts/a.mjs was due on 2026-12-31. Review it again, then set a new recheck date in codeql-exceptions.json."],
  ["matches no result", [exception], [], "2026-10-13", "CodeQL no longer reports js/example in scripts/a.mjs. Remove it from codeql-exceptions.json."],
  ["lacks a reason", [{ ...exception, reason: "" }], [result("warning")], "2026-10-13", "Each entry in codeql-exceptions.json needs a reason."],
  ["has a malformed date", [{ ...exception, recheck: "soon" }], [result("warning")], "2026-10-13", "Write the recheck date of js/example as YYYY-MM-DD."],
]) {
  test(`an exception that ${name} fails`, (t) => {
    const outcome = verify(t, report({ results }), exceptions, today);
    assert.equal(outcome.status, 1);
    assert.ok(outcome.stderr.includes(message), outcome.stderr);
  });
}

for (const [name, sarif, message] of [
  ["no run", { runs: [], version: "2.1.0" }, "CodeQL report lacks runs."],
  ["2 runs", { runs: [report().runs[0], report().runs[0]], version: "2.1.0" }, "Expected 1 SARIF 2.1.0 run."],
  ["no results list", report({ results: undefined }), "CodeQL report lacks results."],
  ["a failed invocation", report({ invocations: [{ executionSuccessful: false, toolExecutionNotifications: [extracted] }] }), "CodeQL invocation failed."],
  ["an error diagnostic", report({ invocations: [{ executionSuccessful: true, toolExecutionNotifications: [extracted, { level: "error", message: { text: "Extraction failed." } }] }] }), "CodeQL diagnostic needs review. Extraction failed."],
  ["no extracted files", report({ invocations: [{ executionSuccessful: true, toolExecutionNotifications: [{ level: "note" }] }] }), "CodeQL did not confirm extracted JavaScript files."],
]) {
  test(`a report with ${name} fails`, (t) => {
    const outcome = verify(t, sarif);
    assert.equal(outcome.status, 1);
    assert.ok(outcome.stderr.includes(message), outcome.stderr);
  });
}

function checkVersion(t, version) {
  const folder = workspace(t);
  writeFakes(folder, version === undefined ? {} : { codeql: `[ "$*" = "version --format=terse" ] || exit 99\necho ${version}` });
  return run(folder, ["/bin/bash", script, "--version"]);
}

for (const version of ["2.27.0", "2.27.2", "2.100.0", "3.0.0"]) {
  test(`CodeQL ${version} prints its version without analyzing`, (t) => {
    const outcome = checkVersion(t, version);
    assert.equal(outcome.status, 0, outcome.stderr);
    assert.equal(outcome.stdout, `${version}\n`);
    assert.deepEqual(outcome.calls, ["codeql version --format=terse"]);
  });
}

for (const [version, message] of [
  [undefined, "CodeQL CLI is missing. Install it with brew install --cask codeql, then rerun."],
  ["2.26.9", "CodeQL CLI 2.26.9 is older than 2.27.0. Run brew upgrade --cask codeql."],
]) {
  test(`CodeQL ${version ?? "missing"} fails with the next step`, (t) => {
    const outcome = checkVersion(t, version);
    assert.equal(outcome.status, 1);
    assert.equal(outcome.stderr, `${message}\n`);
    assert.equal(outcome.stdout, "");
  });
}

test("the analysis uses the security-extended and comment queries and verifies the report", (t) => {
  const folder = workspace(t);
  writeFakes(folder, { codeql: '[ "$1" != version ] || echo 2.27.2', node: "" });
  const outcome = run(folder, ["/bin/bash", script]);
  assert.equal(outcome.status, 0, outcome.stderr);
  const calls = outcome.calls.map((call) => call.replaceAll(/\/[^\s=]*xquik-profile-codeql\.[A-Za-z0-9]+/gu, "<report>"));
  assert.deepEqual(calls, [
    "codeql version --format=terse",
    "codeql pack install codeql/no-code-comments",
    `codeql database create <report>/database --language=javascript-typescript --build-mode=none --source-root=${root.replace(/\/$/u, "")} --threads=2`,
    "codeql database analyze --download <report>/database codeql/javascript-queries@2.4.7:codeql-suites/javascript-security-extended.qls codeql/no-code-comments --format=sarifv2.1.0 --output=<report>/report.sarif --threads=2",
    "node scripts/verify-codeql.mjs <report>/report.sarif codeql-exceptions.json",
  ]);
});
