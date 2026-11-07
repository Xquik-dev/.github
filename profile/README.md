# Xquik Twitter API, X API & Twitter Scraper Tools

Use the Xquik Twitter API to search tweets & posts or export followers.
Pick the REST API, MCP server, SDKs, CLI, webhooks or Apify Actors.

Xquik is the world's fastest and cheapest X (Twitter) scraper service with the most complete X (Twitter) data.
Most other Apify Actors charge before filtering or deduplication.
Xquik charges only for delivered, unique, filter-matching results and never pads rows.
Xquik is independent and not affiliated with X Corp.

<!-- trust:win:start -->
The Xquik X Tweet Scraper read 170 tweets per second at $0.155 per 1,000 on 2026-10-15. The fastest of 4 rival Actors read 12.5 per second. The cheapest cost $0.173 per 1,000. [Compare each run](https://xquik.com/benchmarks#benchmark-x-tweet-scraper).
<!-- trust:win:end -->

## Start with the Twitter API

Create an API key in the [Xquik dashboard](https://dashboard.xquik.com/en/account?tab=api-keys).
Then search tweets & posts with 1 request.

```bash
curl --get 'https://xquik.com/api/v1/x/tweets/search' \
  --header "x-api-key: ${XQUIK_API_KEY}" \
  --data-urlencode 'q=from:NASA' \
  --data-urlencode 'limit=10'
```

Next, read the [Twitter API quickstart](https://docs.xquik.com/x-api-quickstart), [MCP guide](https://docs.xquik.com/mcp/overview) or [API reference](https://docs.xquik.com/api-reference/overview).

<!-- trust:start -->

## Benchmarks & usage

[![Twitter scraper users on Apify](https://img.shields.io/endpoint?url=https%3A%2F%2Fxquik.com%2Fbadges%2Fapify-users.json)](https://apify.com/xquik)
[![Twitter scraper runs on Apify](https://img.shields.io/endpoint?url=https%3A%2F%2Fxquik.com%2Fbadges%2Fapify-runs.json)](https://apify.com/xquik)
[![Tweet scraper rating on Apify](https://img.shields.io/endpoint?url=https%3A%2F%2Fxquik.com%2Fbadges%2Fapify-rating.json)](https://apify.com/xquik/x-tweet-scraper/reviews)
[![Twitter API package downloads](https://img.shields.io/endpoint?url=https%3A%2F%2Fxquik.com%2Fbadges%2Fdownloads.json)](https://xquik.com/benchmarks#downloads)

- 11,000+ users of Xquik's Twitter scraper Actors on Apify ([source](https://apify.com/xquik)) <!-- trust:apify-users 11547 -->
- 8,200,000+ runs of Xquik's Twitter scraper Actors on Apify ([source](https://apify.com/xquik)) <!-- trust:apify-runs 8250808 -->
- 4.66 of 5 for the X Tweet Scraper from 16 Apify reviews ([source](https://apify.com/xquik/x-tweet-scraper/reviews)) <!-- trust:apify-rating 4.66 16 -->
- 63,000+ downloads of Xquik's Twitter API packages on npm, PyPI, RubyGems, NuGet, Packagist & Terraform ([source](https://xquik.com/benchmarks#downloads)) <!-- trust:downloads 63178 -->

Checked on 2026-11-06. See each number with its date & source on [xquik.com/benchmarks](https://xquik.com/benchmarks) or as [JSON](https://xquik.com/trust.json).

<!-- trust:end -->

## Choose a task

| Task | Start here |
| --- | --- |
| Search tweets through an API | [Search Tweets API](https://docs.xquik.com/api-reference/x/search-tweets) |
| Search tweets by date | [Search Tweets by Date Guide](https://docs.xquik.com/guides/search-tweets-by-date) |
| Find X advanced search operators | [Twitter advanced search operators](https://github.com/Xquik-dev/x-twitter-advanced-search) |
| Export public follower lists | [Follower Export Guide](https://docs.xquik.com/guides/follower-export-crm) |
| Monitor accounts or keywords | [Brand Monitoring Guide](https://docs.xquik.com/guides/brand-monitoring-workflow) |
| Receive signed monitor events | [Webhook Guide](https://docs.xquik.com/webhooks/overview) |
| Post or reply from an account | [Create Tweet API](https://docs.xquik.com/api-reference/x-write/create-tweet) |
| Download X (Twitter) videos, GIFs & images | [X (Twitter) Video Downloader](https://xquik.com/en/twitter-video-downloader) |
| Run X (Twitter) scrapers on Apify | [Xquik Apify Actors](https://apify.com/xquik) |
| Call the API from Postman | [Xquik REST API collection](https://documenter.getpostman.com/view/12709954/2sBY4TpxXK) |
| Use X (Twitter) data in Claude, ChatGPT & Cursor | [Coding-agent MCP setup](https://docs.xquik.com/mcp/coding-agents) |
| Compare Xquik with the X API | [X API Alternative Guide](https://docs.xquik.com/alternatives/x-api) |
| Move app code off the X API | [x-api Skill](https://github.com/Xquik-dev/x-api) |

## Twitter API SDKs

Install a typed Twitter API client, the CLI or the Terraform provider.

| SDK | Source | Package |
| --- | --- | --- |
| TypeScript | [x-twitter-scraper-typescript](https://github.com/Xquik-dev/x-twitter-scraper-typescript) | [npm](https://www.npmjs.com/package/x-twitter-scraper) |
| Python | [x-twitter-scraper-python](https://github.com/Xquik-dev/x-twitter-scraper-python) | [PyPI](https://pypi.org/project/x-twitter-scraper/) |
| Go | [x-twitter-scraper-go](https://github.com/Xquik-dev/x-twitter-scraper-go) | [pkg.go.dev](https://pkg.go.dev/github.com/Xquik-dev/x-twitter-scraper-go) |
| Java | [x-twitter-scraper-java](https://github.com/Xquik-dev/x-twitter-scraper-java) | [Maven Central](https://central.sonatype.com/artifact/com.xquik.api/x-twitter-scraper-java) |
| Kotlin | [x-twitter-scraper-kotlin](https://github.com/Xquik-dev/x-twitter-scraper-kotlin) | [Maven Central](https://central.sonatype.com/artifact/com.xquik.api/x-twitter-scraper-kotlin) |
| C# / .NET | [x-twitter-scraper-csharp](https://github.com/Xquik-dev/x-twitter-scraper-csharp) | [NuGet](https://www.nuget.org/packages/XTwitterScraper) |
| PHP | [x-twitter-scraper-php](https://github.com/Xquik-dev/x-twitter-scraper-php) | [Packagist](https://packagist.org/packages/xquik/x-twitter-scraper) |
| Ruby | [x-twitter-scraper-ruby](https://github.com/Xquik-dev/x-twitter-scraper-ruby) | [RubyGems](https://rubygems.org/gems/x-twitter-scraper) |
| CLI | [x-twitter-scraper-cli](https://github.com/Xquik-dev/x-twitter-scraper-cli) | [pkg.go.dev](https://pkg.go.dev/github.com/Xquik-dev/x-twitter-scraper-cli) |
| Terraform | [terraform-provider-x-twitter-scraper](https://github.com/Xquik-dev/terraform-provider-x-twitter-scraper) | [Terraform Registry](https://registry.terraform.io/providers/Xquik-dev/x-twitter-scraper) |

## Agent and workflow integrations

Connect any MCP client to the hosted Xquik server at `https://xquik.com/mcp`.
Install the Xquik Skill with `npx skills add Xquik-dev/x-twitter-scraper`.

| Repository | Integration |
| --- | --- |
| [x-twitter-scraper](https://github.com/Xquik-dev/x-twitter-scraper) | Agent Skill and plugin bundle |
| [xquik-mcp](https://github.com/Xquik-dev/xquik-mcp) | MCP server and agent plugin |
| [tweetclaw](https://github.com/Xquik-dev/tweetclaw) | OpenClaw |
| [hermes-tweet](https://github.com/Xquik-dev/hermes-tweet) | Hermes Agent |
| [n8n-nodes-xquik](https://github.com/Xquik-dev/n8n-nodes-xquik) | n8n |
| [prefect-xquik](https://github.com/Xquik-dev/prefect-xquik) | Prefect |
| [xquik-haystack](https://github.com/Xquik-dev/xquik-haystack) | Haystack |
| [paperclip-plugin-xquik](https://github.com/Xquik-dev/paperclip-plugin-xquik) | Paperclip |
| [xquik-supabase](https://github.com/Xquik-dev/xquik-supabase) | Supabase |
| [xquik-convex](https://github.com/Xquik-dev/xquik-convex) | Convex |
| [xquik-vscode](https://github.com/Xquik-dev/xquik-vscode) | VS Code, VSCodium, Cursor & Windsurf |
| [xquik-raycast](https://github.com/Xquik-dev/xquik-raycast) | Raycast |
| [strapi-plugin-xquik](https://github.com/Xquik-dev/strapi-plugin-xquik) | Strapi 5 |

## Public contract

| Interface | Contract |
| --- | --- |
| REST API | Public operations in the OpenAPI 3.1 contract |
| OpenAPI | 3.1.0 schema at [xquik.com/openapi.json](https://xquik.com/openapi.json) |
| MCP | 4 tools with a searchable operation catalog |
| MCP responses | JSON or text results. Binary downloads use REST |
| Authentication | API keys or OAuth 2.1, depending on the client |
| Webhooks | HMAC-SHA256 signed deliveries |

## Questions

### Do I need an X (Twitter) developer account?

No. Public reads need only an Xquik API key.
Private reads & X (Twitter) account actions need a connected account.

### Is Xquik the official X API?

No. Xquik runs its own REST API.
Its SDKs & integrations call that API, not the official X API.

## Open source

- [Contributing](https://github.com/Xquik-dev/.github/blob/main/CONTRIBUTING.md)
- [Security](https://github.com/Xquik-dev/.github/blob/main/SECURITY.md)
- [Governance](https://github.com/Xquik-dev/.github/blob/main/GOVERNANCE.md)
- [Public roadmap](https://github.com/Xquik-dev/.github/blob/main/ROADMAP.md)
- [OpenSSF evidence](https://github.com/Xquik-dev/.github/blob/main/OPENSSF.md)

Xquik is an independent third-party service. Not affiliated with X Corp. "Twitter" and "X" are trademarks of X Corp.
