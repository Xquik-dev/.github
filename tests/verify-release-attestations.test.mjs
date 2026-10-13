// Copyright the Xquik contributors.
// SPDX-License-Identifier: MIT

import assert from "node:assert/strict";
import { join } from "node:path";
import { test } from "node:test";
import { root, run, workspace, writeFakes } from "./helpers.mjs";

const script = join(root, "scripts/verify-release-attestations");
// The fake gh answers tag v1.2.3, writes the requested artifact, and fails the
// call that the FAILS pattern matches.
const gh = `case "$call" in $FAILS) exit 1 ;; esac
case "$1 $2" in
  "release view") echo v1.2.3 ;;
  "release download") [ "$SKIP" = "$5" ] || : > "$9/$7" ;;
esac`;

function verify(t, env = {}) {
  const folder = workspace(t);
  writeFakes(folder, { gh });
  const result = run(folder, ["/bin/bash", script], { FAILS: "", SKIP: "", ...env });
  return {
    ...result,
    calls: result.calls.map((call) => call.replaceAll(/\S*xquik-profile-attestations\.[A-Za-z0-9]+/gu, "<work>")),
  };
}

function expected(name, artifact, signer) {
  const repository = `Xquik-dev/${name}`;
  return [
    `gh release view --repo ${repository} --json tagName --jq .tagName`,
    `gh release download v1.2.3 --repo ${repository} --pattern ${artifact} --dir <work>/${name}`,
    `gh attestation verify <work>/${name}/${artifact} --repo ${repository} --signer-workflow ${repository}/.github/workflows/${signer} --deny-self-hosted-runners`,
  ];
}

const csharp = expected("x-twitter-scraper-csharp", "XTwitterScraper.1.2.3.nupkg", "publish-nuget.yml");
const go = expected("x-twitter-scraper-go", "x-twitter-scraper-go-v1.2.3.zip", "release-provenance.yml");
const php = expected("x-twitter-scraper-php", "x-twitter-scraper-php-v1.2.3.zip", "release-provenance.yml");

test("each latest artifact is verified against its release workflow on hosted runners", (t) => {
  const result = verify(t);
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(result.calls, [...csharp, ...go, ...php]);
  assert.equal(result.stdout.trimEnd().split("\n").at(-1), "Release attestations verified for the C# SDK, Go SDK, PHP SDK.");
});

for (const [name, env, calls, failed] of [
  ["a failed attestation", { FAILS: "*attestation verify*/x-twitter-scraper-go/*" }, [...csharp, ...go, ...php], "Go SDK"],
  ["an unreadable release", { FAILS: "*release view --repo Xquik-dev/x-twitter-scraper-csharp *" }, [csharp[0], ...go, ...php], "C# SDK"],
  ["a missing artifact", { SKIP: "Xquik-dev/x-twitter-scraper-php" }, [...csharp, ...go, ...php.slice(0, 2)], "PHP SDK"],
]) {
  test(`${name} fails after every SDK is checked`, (t) => {
    const result = verify(t, env);
    assert.equal(result.status, 1);
    assert.deepEqual(result.calls, calls);
    assert.equal(result.stderr.trimEnd().split("\n").at(-1), `Release attestation failed for the ${failed}.`);
  });
}
