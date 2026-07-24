// Copyright the Xquik contributors.
// SPDX-License-Identifier: MIT

const GITHUB_GRAPHQL = "https://api.github.com/graphql";
const GITHUB_REST = "https://api.github.com";
const GITHUB_ORG = "Xquik-dev";
const REVIEW_START = "2026-07-23T00:00:00Z";
const REQUIRED_RATIO = 0.5;
const NON_PROJECT_REPOSITORIES = [".github", "xquik-docs"];
const PROJECTS = [
  "hermes-tweet",
  "n8n-nodes-xquik",
  "paperclip-plugin-xquik",
  "prefect-xquik",
  "terraform-provider-x-twitter-scraper",
  "tweetclaw",
  "x-twitter-scraper",
  "x-twitter-scraper-cli",
  "x-twitter-scraper-csharp",
  "x-twitter-scraper-go",
  "x-twitter-scraper-java",
  "x-twitter-scraper-kotlin",
  "x-twitter-scraper-php",
  "x-twitter-scraper-python",
  "x-twitter-scraper-ruby",
  "x-twitter-scraper-typescript",
  "xquik-haystack",
];
const REVIEW_QUERY = `
  query ReviewEvidence(
    $owner: String!
    $name: String!
    $since: GitTimestamp!
    $after: String
  ) {
    repository(owner: $owner, name: $name) {
      defaultBranchRef {
        target {
          ... on Commit {
            history(first: 100, after: $after, since: $since) {
              nodes {
                oid
                associatedPullRequests(first: 10) {
                  nodes {
                    number
                    author {
                      __typename
                      login
                    }
                    headRefOid
                    mergedAt
                    reviews(first: 100) {
                      nodes {
                        author {
                          __typename
                          login
                        }
                        commit {
                          oid
                        }
                        state
                        submittedAt
                      }
                    }
                  }
                }
              }
              pageInfo {
                endCursor
                hasNextPage
              }
            }
          }
        }
      }
    }
  }
`;

function githubToken() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN is required.");
  return token;
}

function githubHeaders() {
  return {
    accept: "application/vnd.github+json",
    authorization: `Bearer ${githubToken()}`,
    "user-agent": "xquik-review-evidence-check",
  };
}

async function graphql(variables) {
  const response = await fetch(GITHUB_GRAPHQL, {
    method: "POST",
    headers: {
      ...githubHeaders(),
      "content-type": "application/json",
    },
    body: JSON.stringify({ query: REVIEW_QUERY, variables }),
  });
  if (!response.ok) {
    throw new Error(`GitHub GraphQL returned HTTP ${response.status}.`);
  }
  const payload = await response.json();
  if (payload.errors?.length) {
    throw new Error(payload.errors.map(({ message }) => message).join("; "));
  }
  return payload.data;
}

async function loadPublicRepoNames() {
  const names = [];
  for (let page = 1; ; page += 1) {
    const response = await fetch(
      `${GITHUB_REST}/orgs/${GITHUB_ORG}/repos?type=public&per_page=100&page=${page}`,
      { headers: githubHeaders() },
    );
    if (!response.ok) {
      throw new Error(`GitHub REST returned HTTP ${response.status}.`);
    }
    const repositories = await response.json();
    if (!Array.isArray(repositories)) {
      throw new Error("GitHub REST returned an invalid repository inventory.");
    }
    names.push(...repositories.map(({ name }) => name));
    if (repositories.length < 100) return names;
  }
}

async function verifyPublicInventory() {
  const expected = new Set([...NON_PROJECT_REPOSITORIES, ...PROJECTS]);
  const actual = new Set(await loadPublicRepoNames());
  const unexpected = [...actual].filter((name) => !expected.has(name));
  const missing = [...expected].filter((name) => !actual.has(name));
  if (unexpected.length === 0 && missing.length === 0) return;
  throw new Error(
    `Public repository inventory changed. Unexpected: ${unexpected.join(", ") || "none"}. ` +
      `Missing: ${missing.join(", ") || "none"}.`,
  );
}

function hasTwoPersonReview(commit) {
  return commit.associatedPullRequests.nodes.some((pullRequest) => {
    if (!pullRequest.mergedAt || !pullRequest.headRefOid) return false;
    const author = pullRequest.author?.login;
    if (!author) return false;
    return pullRequest.reviews.nodes.some(
      (review) =>
        review.state === "APPROVED" &&
        review.author?.__typename === "User" &&
        review.author.login !== author &&
        review.commit?.oid === pullRequest.headRefOid &&
        review.submittedAt <= pullRequest.mergedAt,
    );
  });
}

async function loadCommits(project) {
  const commits = [];
  let after = null;
  do {
    const data = await graphql({
      owner: GITHUB_ORG,
      name: project,
      since: REVIEW_START,
      after,
    });
    const history = data.repository?.defaultBranchRef?.target?.history;
    if (!history) throw new Error(`${project} has no readable default-branch history.`);
    commits.push(...history.nodes);
    after = history.pageInfo.hasNextPage ? history.pageInfo.endCursor : null;
  } while (after !== null);
  return commits;
}

async function auditProject(project) {
  const commits = await loadCommits(project);
  if (commits.length === 0) {
    throw new Error(`${project} has no commits in the review window.`);
  }
  const reviewed = commits.filter(hasTwoPersonReview);
  return {
    project,
    reviewed: reviewed.length,
    total: commits.length,
    ratio: reviewed.length / commits.length,
  };
}

await verifyPublicInventory();

const results = await Promise.all(PROJECTS.map(auditProject));
const failures = results.filter(({ ratio }) => ratio < REQUIRED_RATIO);

for (const { project, ratio, reviewed, total } of results) {
  process.stdout.write(
    `${project}: ${reviewed}/${total} commits reviewed by a non-author human ` +
      `(${(ratio * 100).toFixed(1)}%).\n`,
  );
}

if (failures.length > 0) {
  throw new Error(
    `Independent review fell below 50% for: ${failures
      .map(({ project }) => project)
      .join(", ")}.`,
  );
}

process.stdout.write(`All ${results.length} projects meet the 50% review threshold.\n`);
