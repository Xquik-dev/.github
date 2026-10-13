// Copyright the Xquik contributors.
// SPDX-License-Identifier: MIT

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { root, workspace } from "./helpers.mjs";

test("the contract check sends the GitHub token to the GitHub API only", (t) => {
  const log = join(workspace(t), "fetch.log");
  writeFileSync(log, "");
  const result = spawnSync(
    process.execPath,
    ["--import", join(root, "tests/record-fetch.mjs"), "scripts/check-public-contract.mjs"],
    { cwd: root, encoding: "utf8", env: { FETCH_LOG: log, GITHUB_TOKEN: "secret-token" } },
  );
  assert.equal(result.status, 1);
  assert.match(result.stderr, /returned HTTP 500\./u);
  const requests = [...new Set(readFileSync(log, "utf8").split("\n").filter(Boolean))].sort();
  assert.deepEqual(requests, ["api.github.com token", "xquik.com anonymous"]);
});
