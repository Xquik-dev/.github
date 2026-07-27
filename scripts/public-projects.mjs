// Copyright the Xquik contributors.
// SPDX-License-Identifier: MIT

export const GITHUB_ORG = "Xquik-dev";

export const SHARED_REPOSITORY_NAMES = [".github", "xquik-docs"];

export const OPENSSF_PROJECTS = [
  ["hermes-tweet", 13725],
  ["n8n-nodes-xquik", 13726],
  ["paperclip-plugin-xquik", 13727],
  ["prefect-xquik", 13728],
  ["terraform-provider-x-twitter-scraper", 13729],
  ["tweetclaw", 13730],
  ["x-twitter-scraper", 13731],
  ["x-twitter-scraper-cli", 13732],
  ["x-twitter-scraper-csharp", 13733],
  ["x-twitter-scraper-go", 13734],
  ["x-twitter-scraper-java", 13735],
  ["x-twitter-scraper-kotlin", 13736],
  ["x-twitter-scraper-php", 13737],
  ["x-twitter-scraper-python", 13738],
  ["x-twitter-scraper-ruby", 13739],
  ["x-twitter-scraper-typescript", 13740],
  ["xquik-haystack", 13741],
];

export const OPENSSF_PROJECT_IDS = new Map(OPENSSF_PROJECTS);

export const OPENSSF_PROJECT_NAMES = OPENSSF_PROJECTS.map(([name]) => name);
