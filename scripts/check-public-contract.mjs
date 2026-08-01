// Copyright the Xquik contributors.
// SPDX-License-Identifier: MIT

import { readFile } from "node:fs/promises";
import { GITHUB_ORG, OPENSSF_PROJECT_IDS } from "./public-projects.mjs";

const GITHUB_API = "https://api.github.com";
const OPENAPI_URL = "https://xquik.com/openapi.json";
const SERVER_CARD_URL = "https://xquik.com/.well-known/mcp/server-card.json";
const HTTP_METHODS = new Set(["delete", "get", "head", "options", "patch", "post", "put", "trace"]);
const INDEPENDENCE_NOTICE =
  'Xquik is an independent third-party service. Not affiliated with X Corp. "Twitter" and "X" are trademarks of X Corp.';
const REPOSITORY_DESCRIPTION_NOTICE = "Not affiliated with X Corp.";
const DISCOVERY_TOPICS = new Set([
  "tweet-search",
  "twitter-api",
  "twitter-scraper",
  "x-api",
  "x-automation",
]);
const VAGUE_LINK_TEXT = /\[(?:click here|here|link|read more)\]\(/iu;
const EMPTY_IMAGE_ALT = /!\[\s*\]\(/u;
const COMMUNITY_POLICY_REQUIREMENTS = new Map([
  [
    "ASSURANCE.md",
    [
      "## Project Architecture",
      "## Threat Model",
      "## Secure Design Argument",
      "## Common Weakness Countermeasures",
      "Pending changes do not count as default-branch evidence.",
    ],
  ],
  [
    "BUILD_DEBUG.md",
    [
      "17 standalone software projects",
      "Do not count pending changes as default-branch evidence.",
      "## Native Release Verification",
      "## JVM Verification",
      "## Source Package Verification",
    ],
  ],
  ["CODE_OF_CONDUCT.md", ["## Enforcement", "support@xquik.com"]],
  [
    "CONTRIBUTING.md",
    ["Developer Certificate of Origin", "git commit -s", "good first issue"],
  ],
  [
    "DISCOVERY.md",
    [
      "## Repository Metadata",
      "## README Structure",
      "## Answer-Engine & Agent Readiness",
      "Do not repeat keyword variants without adding useful information.",
      "Do not treat `llms.txt` as a Google ranking signal.",
    ],
  ],
  [
    "GOVERNANCE.md",
    ["## Roles", "## Continuity", "does not meet this continuity target yet"],
  ],
  [
    "OPENSSF.md",
    [
      "17 standalone software projects",
      "xquik-docs",
      "## Newcomer Tasks",
      "These tasks satisfy the Gold `small_tasks` evidence requirement.",
      "Known Gold Gaps",
    ],
  ],
  ["REVIEWING.md", ["person other than the author", "At least 50%"]],
  [
    "RELEASES.md",
    [
      "## Verify npm Provenance",
      "## Verify PyPI Attestations",
      "## Verify RubyGems Attestations",
      "## Verify GitHub Attestations",
      "## Verify Project-Controlled SDK Artifacts",
      "6dfdcabd408a330d80ef87f4e650aca0004ba8a0eb8b49cb92e06a97a7cf5502",
      "17aaf5366ab6ad65869e5fb4f92acb2351bb08e0a12a0d4fcab6de8875193916",
      "7bef1ec1688b472424d7e92738342a446abfa6a9b1d314c4cd66fff919b5f34f",
      "a59bd116af5ff6cc911c38b2fd515559d5f97b3eeb489d1a6148fd13fb459fb0",
      "31fdf66d8cb1d0d8aeacbb8748189029eafc8b178b905057fd35540f5a01589b",
      "Keep `version_tags_signed` Unmet",
    ],
  ],
  [
    "REVIEW_EVIDENCE.md",
    [
      "The review policy took effect on July 23, 2026.",
      "The `.github` and `xquik-docs` repositories provide shared community and documentation surfaces.",
      "Count direct commits as unreviewed.",
      "Require a known author and approval from another human.",
      "All 17 projects meet the required 50% threshold.",
    ],
  ],
  ["ROADMAP.md", ["July 2027", "OpenSSF Best Practices"]],
  [
    "SECURITY.md",
    [
      "within 3 business days",
      "within 14 days",
      "within 60 days",
      "credit every reporter unless they request anonymity",
      "TLS 1.2",
    ],
  ],
]);
const STALE_PUBLIC_COPY = [
  /\b40\+ (?:agents|integrations|tools)/iu,
  /\b47\+ (?:agents|integrations|tools)/iu,
  /\b126 (?:API |OpenAPI |REST )?operations/iu,
  /\b127 endpoints/iu,
  /\b119 catalog routes/iu,
  /\b118 (?:catalog )?routes/iu,
  /\b118 operations through 2 tools/iu,
  /\b2\.5\.4\b/u,
];
const INTEGRATION_SURFACES = [
  {
    repo: "n8n-nodes-xquik",
    file: "nodes/Xquik/Xquik.node.ts",
    baseFile: "nodes/Xquik/GenericFunctions.ts",
    operations: [
      { path: "/credits", pathNeedle: "'/credits'", query: [] },
      {
        path: "/x/tweets/search",
        pathNeedle: "'/x/tweets/search'",
        query: ["q", "queryType", "limit", "cursor", "fromUser", "language", "sinceTime", "untilTime", "verifiedOnly"],
      },
      { path: "/x/users/search", pathNeedle: "'/x/users/search'", query: ["q", "cursor"] },
      { path: "/trends", pathNeedle: "'/trends'", query: ["woeid", "count"] },
      { path: "/x/followers/check", pathNeedle: "'/x/followers/check'", query: ["source", "target"] },
    ],
  },
  {
    repo: "paperclip-plugin-xquik",
    file: "src/worker.ts",
    baseFile: "src/constants.ts",
    operations: [
      { path: "/x/tweets/search", pathNeedle: '"/x/tweets/search"', query: ["q", "queryType", "limit", "cursor", "sinceTime", "untilTime"] },
      { path: "/x/tweets/{id}", pathNeedle: "/x/tweets/${", query: [] },
      { path: "/x/users/search", pathNeedle: '"/x/users/search"', query: ["q", "cursor"] },
      { path: "/x/users/{id}", pathNeedle: "/x/users/${", query: [] },
      { path: "/x/users/{id}/tweets", pathNeedle: "}/tweets`,", query: ["cursor", "includeReplies", "includeParentTweet"] },
      { path: "/x/trends", pathNeedle: '"/x/trends"', query: ["woeid", "count"] },
    ],
  },
  {
    repo: "prefect-xquik",
    file: "prefect_xquik/client.py",
    operations: [
      { path: "/x/tweets/search", pathNeedle: '"/x/tweets/search"', query: ["q", "queryType", "limit", "cursor", "sinceTime", "untilTime"] },
      { path: "/x/tweets/{id}", pathNeedle: 'f"/x/tweets/{quoted_id}"', query: [] },
      { path: "/x/users/search", pathNeedle: '"/x/users/search"', query: ["q", "cursor"] },
      { path: "/x/users/{id}", pathNeedle: 'f"/x/users/{quoted_id}"', query: [] },
      { path: "/x/users/{id}/tweets", pathNeedle: 'f"/x/users/{quoted_id}/tweets"', query: ["cursor", "includeReplies", "includeParentTweet"] },
      { path: "/x/trends", pathNeedle: '"/x/trends"', query: ["woeid", "count"] },
    ],
  },
  {
    repo: "xquik-haystack",
    file: "src/haystack_integrations/components/websearch/xquik/xquik_websearch.py",
    operations: [
      { path: "/x/tweets/search", pathNeedle: '}/x/tweets/search"', query: ["q", "queryType", "limit", "cursor", "sinceTime", "untilTime"] },
      { path: "/x/users/{id}/tweets", pathNeedle: "}/x/users/{quote(user_id, safe='')}/tweets\"", query: ["cursor", "includeReplies", "includeParentTweet"] },
    ],
  },
];

function requestHeaders(accept) {
  const headers = { accept, "user-agent": "xquik-public-contract-check" };
  if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return headers;
}

async function fetchResource(url, accept) {
  const response = await fetch(url, { headers: requestHeaders(accept) });
  if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}.`);
  return response;
}

async function fetchJson(url) {
  return (await fetchResource(url, "application/json")).json();
}

async function fetchText(url, accept = "text/plain") {
  return (await fetchResource(url, accept)).text();
}

function operationCount(openApi) {
  return Object.values(openApi.paths ?? {}).reduce(
    (total, pathItem) =>
      total +
      Object.keys(pathItem ?? {}).filter((key) => HTTP_METHODS.has(key)).length,
    0,
  );
}

function requireCount(description, label, pattern) {
  const match = pattern.exec(description);
  if (match?.groups?.count === undefined) {
    throw new Error(`Server card is missing the ${label} count.`);
  }
  return Number(match.groups.count);
}

async function loadServerCard() {
  const localPath = process.argv[2];
  if (localPath === undefined) return fetchJson(SERVER_CARD_URL);
  return JSON.parse(await readFile(localPath, "utf8"));
}

async function listPublicRepos() {
  const repos = [];
  for (let page = 1; ; page += 1) {
    const batch = await fetchJson(
      `${GITHUB_API}/orgs/${GITHUB_ORG}/repos?type=public&per_page=100&page=${page}`,
    );
    repos.push(...batch);
    if (batch.length < 100) return repos;
  }
}

function contentUrl(repo, path) {
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  return `${GITHUB_API}/repos/${GITHUB_ORG}/${repo.name}/contents/${encodedPath}?ref=${encodeURIComponent(repo.default_branch)}`;
}

async function loadRepoFile(repo, path) {
  if (repo.name === ".github") return readFile(path, "utf8");
  return fetchText(contentUrl(repo, path), "application/vnd.github.raw+json");
}

function visibleMarkdown(markdown) {
  return markdown.replace(/[*_`>#]/gu, "").replace(/\s+/gu, " ").trim();
}

function markdownHeadings(markdown) {
  const headings = [];
  let fence = null;
  for (const line of markdown.split(/\r?\n/u)) {
    const fenceMatch = /^ {0,3}(`{3,}|~{3,})/u.exec(line);
    if (fenceMatch) {
      const marker = fenceMatch[1][0];
      if (fence === null) fence = marker;
      else if (fence === marker) fence = null;
      continue;
    }
    if (fence !== null) continue;
    const heading = /^ {0,3}(#{1,6})[ \t]+(.+?)[ \t]*#*[ \t]*$/u.exec(line);
    if (heading) headings.push({ level: heading[1].length, text: heading[2].trim() });
  }
  return headings;
}

function resolveParameter(openApi, parameter) {
  if (!parameter?.$ref) return parameter;
  const name = parameter.$ref.split("/").at(-1);
  return openApi.components?.parameters?.[name];
}

function operationQueryParameters(openApi, path, method) {
  const publicPath = openApi.paths?.[path] ? path : `/api/v1${path}`;
  const pathItem = openApi.paths?.[publicPath];
  const operation = pathItem?.[method];
  if (!operation) throw new Error(`OpenAPI is missing ${method.toUpperCase()} ${path}.`);
  return new Set(
    [...(pathItem.parameters ?? []), ...(operation.parameters ?? [])]
      .map((parameter) => resolveParameter(openApi, parameter))
      .filter((parameter) => parameter?.in === "query")
      .map((parameter) => parameter.name),
  );
}

async function checkRepoReadmes(repos) {
  await Promise.all(
    repos.map(async (repo) => {
      const path = repo.name === ".github" ? "profile/README.md" : "README.md";
      const readme = await loadRepoFile(repo, path);
      const visible = visibleMarkdown(readme);
      const headings = markdownHeadings(readme);
      const titleHeadings = headings.filter(({ level }) => level === 1);
      const sectionHeadings = headings.filter(({ level }) => level === 2);
      if (titleHeadings.length !== 1) {
        throw new Error(`${repo.name}/${path} must contain exactly one top-level heading.`);
      }
      const title = titleHeadings[0].text;
      if (title.length < 10 || title.length > 110) {
        throw new Error(`${repo.name}/${path} has an unclear title length: ${title.length}.`);
      }
      if (sectionHeadings.length < 3) {
        throw new Error(`${repo.name}/${path} needs at least 3 descriptive sections.`);
      }
      if (
        !sectionHeadings.some(({ text }) =>
          /\b(?:choose|command|operation|question|search|start|task|tool|use|workflow)s?\b/iu.test(
            text,
          ),
        )
      ) {
        throw new Error(`${repo.name}/${path} needs a task-oriented section heading.`);
      }
      if (repo.name !== ".github" && !/^ {0,3}(?:`{3,}|~{3,})/mu.test(readme)) {
        throw new Error(`${repo.name}/${path} needs a runnable or copyable example.`);
      }
      if (VAGUE_LINK_TEXT.test(readme)) {
        throw new Error(`${repo.name}/${path} contains vague link text.`);
      }
      if (EMPTY_IMAGE_ALT.test(readme)) {
        throw new Error(`${repo.name}/${path} contains an image without alternative text.`);
      }
      if (!visible.includes(INDEPENDENCE_NOTICE)) {
        throw new Error(`${repo.name}/${path} is missing the approved independence notice.`);
      }
      const projectId = OPENSSF_PROJECT_IDS.get(repo.name);
      if (projectId !== undefined) {
        const badgeUrl = `https://www.bestpractices.dev/projects/${projectId}/badge`;
        if (!readme.includes(badgeUrl)) {
          throw new Error(`${repo.name}/${path} is missing OpenSSF badge ${projectId}.`);
        }
      }
      const stale = STALE_PUBLIC_COPY.find((pattern) => pattern.test(visible));
      if (stale) throw new Error(`${repo.name}/${path} contains stale public copy: ${stale}.`);
    }),
  );
}

function checkRepoDiscovery(repos) {
  for (const repo of repos) {
    const description = repo.description?.trim() ?? "";
    const topics = repo.topics ?? [];
    if (description.length < 94 || description.length > 140) {
      throw new Error(`${repo.name} has an unclear repository description length.`);
    }
    if (!description.endsWith(REPOSITORY_DESCRIPTION_NOTICE)) {
      throw new Error(`${repo.name} is missing the compact independence notice.`);
    }
    const purpose = description
      .slice(0, -REPOSITORY_DESCRIPTION_NOTICE.length)
      .replace(/\.\s*$/u, "")
      .trim();
    const purposeWords = purpose.split(/\s+/u).length;
    if (purposeWords < 9 || purposeWords > 14) {
      throw new Error(`${repo.name} must use 9-14 words before its independence notice.`);
    }
    if (!repo.homepage?.startsWith("https://")) {
      throw new Error(`${repo.name} needs an HTTPS homepage.`);
    }
    if (topics.length < 5 || topics.length > 20) {
      throw new Error(`${repo.name} must use 5-20 accurate discovery topics.`);
    }
    if (!topics.includes("xquik")) {
      throw new Error(`${repo.name} is missing the xquik discovery topic.`);
    }
    if (!topics.some((topic) => DISCOVERY_TOPICS.has(topic))) {
      throw new Error(`${repo.name} is missing an accurate customer-intent topic.`);
    }
  }
}

async function checkCommunityPolicies() {
  await Promise.all(
    [...COMMUNITY_POLICY_REQUIREMENTS].map(async ([path, requirements]) => {
      const content = await readFile(path, "utf8");
      for (const requirement of requirements) {
        if (!content.includes(requirement)) {
          throw new Error(`${path} is missing required policy text: ${requirement}`);
        }
      }
    }),
  );
}

async function checkOpenSsfInventory() {
  const evidence = await readFile("OPENSSF.md", "utf8");
  for (const [repo, projectId] of OPENSSF_PROJECT_IDS) {
    const entry =
      `| \`${repo}\` | [OpenSSF project ${projectId}]` +
      `(https://www.bestpractices.dev/projects/${projectId}) |`;
    if (!evidence.includes(entry)) {
      throw new Error(`OPENSSF.md is missing ${repo} project ${projectId}.`);
    }
  }
}

async function checkIntegrationSurfaces(openApi, reposByName) {
  await Promise.all(
    INTEGRATION_SURFACES.map(async (surface) => {
      const repo = reposByName.get(surface.repo);
      if (!repo) throw new Error(`Public repository ${surface.repo} is missing.`);
      const source = await loadRepoFile(repo, surface.file);
      const baseSource = surface.baseFile ? await loadRepoFile(repo, surface.baseFile) : source;
      if (!baseSource.includes("https://xquik.com/api/v1")) {
        throw new Error(`${surface.repo}/${surface.baseFile ?? surface.file} has the wrong API base URL.`);
      }
      for (const operation of surface.operations) {
        const available = operationQueryParameters(openApi, operation.path, "get");
        if (!source.includes(operation.pathNeedle)) {
          throw new Error(`${surface.repo}/${surface.file} is missing GET ${operation.path}.`);
        }
        for (const parameter of operation.query) {
          if (!available.has(parameter)) {
            throw new Error(`OpenAPI no longer accepts ${parameter} for GET ${operation.path}.`);
          }
          if (!source.includes(parameter)) {
            throw new Error(`${surface.repo}/${surface.file} is missing ${parameter} for GET ${operation.path}.`);
          }
        }
      }
    }),
  );
}

const [openApi, serverCard, profile, repos] = await Promise.all([
  fetchJson(OPENAPI_URL),
  loadServerCard(),
  readFile("profile/README.md", "utf8"),
  listPublicRepos(),
]);
const reposByName = new Map(repos.map((repo) => [repo.name, repo]));
const restCount = operationCount(openApi);
const cardDescription = serverCard.description ?? "";
const cardRestCount = requireCount(
  cardDescription,
  "REST operations",
  /(?<count>\d+) REST operations\b/u,
);
const mcpCount = requireCount(
  cardDescription,
  "MCP routes",
  /(?<count>\d+) MCP (?:catalog )?routes\b/u,
);
const textCount = requireCount(
  cardDescription,
  "JSON/text operations",
  /(?<count>\d+) (?:JSON or text operations|JSON\/text ops)\b/u,
);

checkRepoDiscovery(repos);

if (cardRestCount !== restCount) {
  throw new Error(`Server card says ${cardRestCount} REST operations; OpenAPI has ${restCount}.`);
}
for (const expected of [
  `| REST API | ${restCount} OpenAPI-backed operations |`,
  `${mcpCount} catalog routes through 2 tools`,
  `${textCount} JSON or text operations are supported`,
]) {
  if (!profile.includes(expected)) {
    throw new Error(`profile/README.md is missing: ${expected}`);
  }
}
if (/126 operations|40\+ agents|118 operations through 2 tools/u.test(profile)) {
  throw new Error("profile/README.md contains a stale public count.");
}

await Promise.all([
  checkCommunityPolicies(),
  checkOpenSsfInventory(),
  checkIntegrationSurfaces(openApi, reposByName),
  checkRepoReadmes(repos),
]);

process.stdout.write(
  `Checked ${repos.length} public repositories. Contracts match ${restCount} REST, ${mcpCount} MCP, and ${textCount} JSON/text operations.\n`,
);
