// Copyright the Xquik contributors.
// SPDX-License-Identifier: MIT

import { appendFileSync } from "node:fs";

globalThis.fetch = async (url, options = {}) => {
  const sent = new Headers(options.headers).has("authorization") ? "token" : "anonymous";
  appendFileSync(process.env.FETCH_LOG, `${new URL(url).host} ${sent}\n`);
  return new Response("{}", { status: 500 });
};
