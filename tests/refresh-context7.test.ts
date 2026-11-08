// Copyright the Xquik contributors.
// SPDX-License-Identifier: MIT

import assert from "node:assert/strict";
import { join } from "node:path";
import { type TestContext, test } from "node:test";
import { root, run, workspace, writeFakes } from "./helpers.ts";

const script = join(root, "bin/refresh-context7");
const item = "test-item";
const readKey = `security find-generic-password -s ${item} -w`;
const fakes = {
  // Writes the body to the -o file, records the headers from standard input,
  // and prints the status.
  curl: `[ -n "$STATUS" ] || exit 7
printf 'stdin %s\\n' "$(cat)" >> "$FAKE_CALLS"
while [ "$#" -gt 0 ]; do [ "$1" != -o ] || printf '%s' "$BODY" > "$2"; shift; done
printf '%s' "$STATUS"`,
  security: `[ "$call" = "$READ_KEY" ] || exit 44
printf '%s\\n' "$KEY"`,
};
const request =
  "curl --connect-timeout 10 --max-time 30 --proto =https -sS --tlsv1.2 -o <body> -w %{http_code} -X POST " +
  'https://context7.com/api/v1/refresh -H Content-Type: application/json -H @- -d {"libraryName": "/xquik-dev/.github"}';

function refresh(t: TestContext, env: Readonly<Record<string, string>> = {}, args: readonly string[] = []) {
  const folder = workspace(t);
  writeFakes(folder, fakes);
  const result = run(folder, ["/bin/bash", script, ...args], {
    BODY: "",
    CONTEXT7_KEYCHAIN_SERVICE: item,
    READ_KEY: readKey,
    KEY: "secret-key",
    STATUS: "200",
    ...env,
  });
  return {
    ...result,
    calls: result.calls.map((call) => call.replaceAll(/\S*xquik-profile-context7\.[A-Za-z0-9]+/gu, "<body>")),
    last: `${result.stdout}${result.stderr}`.trimEnd().split("\n").at(-1),
  };
}

test("a refresh sends the key on standard input and never as an argument", (t) => {
  const result = refresh(t, { BODY: '{"ok":true}' });
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(result.calls, [
    readKey,
    request,
    "stdin Authorization: Bearer secret-key",
  ]);
  assert.equal(result.stdout, '{"ok":true}\nContext7 accepted the refresh.\n');
});

for (const [status, body, exit, last] of [
  ["202", "", 0, "Context7 accepted the refresh."],
  ["400", "active-task", 0, "Context7 is already processing another library. Rerun after the next docs change."],
  ["400", "too-early", 0, "Context7 refresh is not due yet."],
  ["400", "bad request", 1, "refresh-context7: Context7 refresh returned HTTP 400."],
  ["401", "", 1, "refresh-context7: Context7 authentication failed. Replace the API key in the Keychain, then rerun."],
  ["403", "", 1, "refresh-context7: Context7 authentication failed. Replace the API key in the Keychain, then rerun."],
  ["404", "", 0, "Context7 has not indexed /xquik-dev/.github yet. Rerun after indexing finishes."],
  ["429", "", 0, "Context7 refresh is rate limited. Rerun after the next docs change."],
  ["500", "", 1, "refresh-context7: Context7 refresh returned HTTP 500."],
  ["", "", 1, "refresh-context7: Could not reach Context7. Check network access, then rerun."],
] as const) {
  test(`HTTP ${status || "failure"} with body "${body}" exits ${exit}`, (t) => {
    const result = refresh(t, { BODY: body, STATUS: status });
    assert.equal(result.status, exit);
    assert.equal(result.last, last);
  });
}

for (const [name, env, message] of [
  ["an unset item name", { CONTEXT7_KEYCHAIN_SERVICE: "" }, "CONTEXT7_KEYCHAIN_SERVICE is unset. Set it to the Keychain item that holds the Context7 API key, then rerun."],
  ["a missing Keychain item", { CONTEXT7_KEYCHAIN_SERVICE: "other-item" }, "The Keychain has no item named by CONTEXT7_KEYCHAIN_SERVICE. Add the Context7 API key under that name, then rerun."],
  ["an empty key", { KEY: "" }, "The Keychain has no item named by CONTEXT7_KEYCHAIN_SERVICE. Add the Context7 API key under that name, then rerun."],
] as const) {
  test(`${name} stops before any request`, (t) => {
    const result = refresh(t, env);
    assert.equal(result.status, 1);
    assert.equal(result.stderr, `refresh-context7: ${message}\n`);
    assert.equal(result.calls.filter((call) => call.startsWith("curl")).length, 0);
  });
}

test("a dry run reads no key and sends nothing", (t) => {
  const result = refresh(t, {}, ["--dry-run"]);
  assert.equal(result.status, 0);
  assert.deepEqual(result.calls, []);
  assert.equal(
    result.stdout,
    "Dry run finished. It would ask https://context7.com/api/v1/refresh to refresh /xquik-dev/.github, and it read no key.\n",
  );
});
