# Xquik GitHub: X API SDKs, Agent Tools & OpenSSF Evidence

> **Xquik is an independent third-party service.** Not affiliated with X Corp.
> "Twitter" and "X" are trademarks of X Corp.

[![Ask DeepWiki](https://deepwiki.com/badge.svg?url=https%3A%2F%2Fgithub.com%2FXquik-dev%2F.github)](https://deepwiki.com/Xquik-dev/.github)
[![Skills.sh x-twitter-scraper Skill](https://skills.sh/b/xquik-dev/x-twitter-scraper)](https://skills.sh/xquik-dev/x-twitter-scraper)

Public GitHub profile and community defaults for Xquik SDKs, docs, and agent integrations.

- Org profile: [profile/README.md](profile/README.md)
- Agent skill: [Xquik-dev/x-twitter-scraper](https://github.com/Xquik-dev/x-twitter-scraper)
- Docs: [docs.xquik.com](https://docs.xquik.com)
- Security reports: [SECURITY.md](SECURITY.md)
- Support issues: [SUPPORT.md](SUPPORT.md)
- Contributing: [CONTRIBUTING.md](CONTRIBUTING.md)
- Governance: [GOVERNANCE.md](GOVERNANCE.md)
- Code review: [REVIEWING.md](REVIEWING.md)
- Public roadmap: [ROADMAP.md](ROADMAP.md)
- OpenSSF evidence: [OPENSSF.md](OPENSSF.md)
- Debug-information evidence: [BUILD_DEBUG.md](BUILD_DEBUG.md)
- Six-month regression evidence: [REGRESSION_TESTS.md](REGRESSION_TESTS.md)
- Two-person review evidence: [REVIEW_EVIDENCE.md](REVIEW_EVIDENCE.md)
- Discovery and README policy: [DISCOVERY.md](DISCOVERY.md)
- Code of Conduct: [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)

## Find a Workflow

| Customer Question | Start Here |
| --- | --- |
| How do I search tweets through an API? | [Search Tweets API](https://docs.xquik.com/api-reference/x/search-tweets) |
| How do I export followers? | [Follower Export Guide](https://docs.xquik.com/guides/follower-export-crm) |
| Which SDK should my application use? | [SDK directory](profile/README.md#sdks) |
| How can an AI agent use Xquik? | [Agent integrations](profile/README.md#agent-and-workflow-integrations) |
| Where is the OpenSSF evidence? | [OpenSSF evidence register](OPENSSF.md) |

For SDK repositories, start from the org profile or the language-specific repositories listed there.

## Validate Public Contracts

Run the default-branch audit:

```sh
GITHUB_TOKEN="$(gh auth token)" node scripts/check-public-contract.mjs
```

Use exact branch refs for coordinated pull requests:

```sh
XQUIK_PUBLIC_REPO_REFS='{"x-twitter-scraper":"BRANCH","xquik-docs":"BRANCH"}' \
  GITHUB_TOKEN="$(gh auth token)" node scripts/check-public-contract.mjs
```

Unspecified repositories still use their default branches.

Xquik is an independent third-party service. Not affiliated with X Corp. "Twitter" and "X" are trademarks of X Corp.
