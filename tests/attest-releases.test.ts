// Copyright the Xquik contributors.
// SPDX-License-Identifier: MIT

import assert from "node:assert/strict";
import { join } from "node:path";
import { type TestContext, test } from "node:test";
import { root, run, workspace, writeFakes } from "./helpers.ts";

const head = "0123456789abcdef0123456789abcdef01234567";
const attested = [
  "terraform-provider-x-twitter-scraper",
  "x-twitter-scraper-csharp",
  "x-twitter-scraper-python",
  "x-twitter-scraper-ruby",
  "x-twitter-scraper-typescript",
];

// gh prints the signed repository, tag and tag sha, and fails for the repository CASE names
// until its count file holds FAILS lines.
function attest(t: TestContext, env: Readonly<Record<string, string>> = {}) {
  const folder = workspace(t);
  writeFakes(folder, {
    git: `[ "$*" = "rev-parse HEAD" ] && echo ${head}`,
    gh: `repo="$4"
if [ "$repo" = "Xquik-dev/$CASE" ] && [ "$(wc -l < "$FAKE_CALLS.$CASE" 2>/dev/null || echo 0)" -lt "\${FAILS:-3}" ]; then
  echo x >> "$FAKE_CALLS.$CASE"
  echo "Error: could not reach the trust root" >&2
  exit 1
fi
printf '%s\\tv1.2.3\\t%s\\n' "$repo" "\${SHA:-aaaa}"`,
  });
  const result = run(folder, [process.execPath, join(root, "scripts/attest-releases.ts")], {
    XQUIK_RETRY_MS: "0",
    CASE: "none",
    ...env,
  });
  return { ...result, verifies: result.calls.filter((call) => call.startsWith("gh ")) };
}

test("the evidence names HEAD, the time and the signed release of every attested project", (t) => {
  const before = Date.now();
  const result = attest(t);
  assert.equal(result.status, 0, result.stderr);
  const evidence: unknown = JSON.parse(result.stdout);
  assert.ok(evidence && typeof evidence === "object" && "verifiedAt" in evidence && typeof evidence.verifiedAt === "string");
  assert.ok(Date.parse(evidence.verifiedAt) >= before);
  assert.deepEqual(evidence, {
    commit: head,
    verifiedAt: evidence.verifiedAt,
    releases: attested.map((repo) => ({ repo: `Xquik-dev/${repo}`, tag: "v1.2.3", sha: "aaaa" })),
  });
  assert.equal(result.verifies.length, 5);
  assert.match(result.verifies[0] ?? "", /^gh release verify --repo Xquik-dev\/terraform-provider-x-twitter-scraper --format json --jq /u);
});

test("a verification that fails twice passes on the third try", (t) => {
  const result = attest(t, { CASE: "x-twitter-scraper-ruby", FAILS: "2" });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.verifies.length, 7);
});

test("a release that fails 3 times prints no evidence and names the release", (t) => {
  const result = attest(t, { CASE: "x-twitter-scraper-ruby" });
  assert.equal(result.status, 1);
  assert.equal(result.stdout, "");
  assert.equal(
    result.stderr,
    "gh release verify failed 3 times for the latest release of Xquik-dev/x-twitter-scraper-ruby. Error: could not reach the trust root\n",
  );
});

test("output without a tag sha counts as a failed verification", (t) => {
  const result = attest(t, { SHA: "" });
  assert.equal(result.status, 1);
  assert.equal(result.stdout, "");
  assert.match(result.stderr, /^gh release verify failed 3 times for the latest release of Xquik-dev\/terraform-provider-x-twitter-scraper\. gh printed /u);
});
