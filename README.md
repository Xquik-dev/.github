# Xquik Twitter API, SDKs & Agent Tools

Use this Xquik repository to find the policies every Xquik-dev project shares.
The [org profile](profile/README.md) lists each SDK & integration.

Xquik is the world's fastest and cheapest X Twitter scraper service with the most complete X data.
Most other Apify Actors charge before filtering or deduplication.
Xquik charges only for delivered, unique, filter-matching results and never pads rows.
Xquik is independent and not affiliated with X Corp.

<!-- trust:win:start -->
<!-- trust:win:end -->

## Start with the Twitter API

Create an API key in the [Xquik dashboard](https://dashboard.xquik.com/en/account?tab=api-keys).
Then search tweets with 1 request.

```bash
curl --get 'https://xquik.com/api/v1/x/tweets/search' \
  --header "x-api-key: ${XQUIK_API_KEY}" \
  --data-urlencode 'q=from:NASA' \
  --data-urlencode 'limit=10'
```

Next, read the [Twitter API quickstart](https://docs.xquik.com/x-api-quickstart), the [benchmarks](https://xquik.com/benchmarks) or the [org profile](profile/README.md).

<!-- trust:start -->
<!-- trust:end -->

## Find a workflow

| Task | Start here |
| --- | --- |
| Search tweets through an API | [Search Tweets API](https://docs.xquik.com/api-reference/x/search-tweets) |
| Export followers | [Follower Export Guide](https://docs.xquik.com/guides/follower-export-crm) |
| Choose an SDK | [SDK directory](profile/README.md#twitter-api-sdks) |
| Connect an AI agent | [Agent integrations](profile/README.md#agent-and-workflow-integrations) |

## Project policies

- [Security reports](SECURITY.md)
- [Support issues](SUPPORT.md)
- [Contributing](CONTRIBUTING.md)
- [Governance](GOVERNANCE.md)
- [Code review](REVIEWING.md)
- [Public roadmap](ROADMAP.md)
- [OpenSSF evidence](OPENSSF.md)
- [Debug-information evidence](BUILD_DEBUG.md)
- [6-month regression evidence](REGRESSION_TESTS.md)
- [2-person review evidence](REVIEW_EVIDENCE.md)
- [Discovery & README policy](DISCOVERY.md)
- [Code of conduct](CODE_OF_CONDUCT.md)

## Questions

### Do I need an X developer account?

No. Public reads need only an Xquik API key.
Private reads & X account actions need a connected X account.

### Which projects use these policies?

Every Xquik-dev repository without its own file uses them.
GitHub reads these defaults from this repository.

## More Xquik tools

- [X (Twitter) scraper API & Twitter MCP server](https://github.com/Xquik-dev/x-twitter-scraper) with REST, MCP & Skill setup.
- [Twitter advanced search operators](https://github.com/Xquik-dev/x-twitter-advanced-search) with tested examples.
- [Twitter API documentation](https://docs.xquik.com/api-reference/overview) for every REST route.

Xquik is an independent third-party service. Not affiliated with X Corp. "Twitter" and "X" are trademarks of X Corp.
