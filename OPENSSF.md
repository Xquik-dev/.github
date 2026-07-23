# OpenSSF Best Practices Evidence

This register tracks OpenSSF Best Practices work across Xquik-dev.

It records project scope, live badge entries, shared evidence, and known gaps.

## Applicability

OpenSSF badges apply to FLOSS projects, not automatically to every repository.

OpenSSF defines project sites as supporting project development and dissemination.

See the official [criteria terminology](https://www.bestpractices.dev/en/criteria_discussion#terminology).

Xquik-dev has 17 standalone software projects with badge entries.

Two repositories serve those projects without separate releases:

- `.github` provides shared governance, policies, templates, and organization discovery.
- `xquik-docs` provides shared API, SDK, integration, and security documentation.

These repositories act as shared project sites and project-result sources.

They do not currently operate as independent released projects.

Create separate badge entries if either repository becomes independently released.

## Live Project Entries

All 17 project entries achieved Passing before July 23, 2026.

Use each live entry for current status and submitted evidence.

| Repository | Live Entry |
| --- | --- |
| `hermes-tweet` | [OpenSSF project 13725](https://www.bestpractices.dev/projects/13725) |
| `n8n-nodes-xquik` | [OpenSSF project 13726](https://www.bestpractices.dev/projects/13726) |
| `paperclip-plugin-xquik` | [OpenSSF project 13727](https://www.bestpractices.dev/projects/13727) |
| `prefect-xquik` | [OpenSSF project 13728](https://www.bestpractices.dev/projects/13728) |
| `terraform-provider-x-twitter-scraper` | [OpenSSF project 13729](https://www.bestpractices.dev/projects/13729) |
| `tweetclaw` | [OpenSSF project 13730](https://www.bestpractices.dev/projects/13730) |
| `x-twitter-scraper` | [OpenSSF project 13731](https://www.bestpractices.dev/projects/13731) |
| `x-twitter-scraper-cli` | [OpenSSF project 13732](https://www.bestpractices.dev/projects/13732) |
| `x-twitter-scraper-csharp` | [OpenSSF project 13733](https://www.bestpractices.dev/projects/13733) |
| `x-twitter-scraper-go` | [OpenSSF project 13734](https://www.bestpractices.dev/projects/13734) |
| `x-twitter-scraper-java` | [OpenSSF project 13735](https://www.bestpractices.dev/projects/13735) |
| `x-twitter-scraper-kotlin` | [OpenSSF project 13736](https://www.bestpractices.dev/projects/13736) |
| `x-twitter-scraper-php` | [OpenSSF project 13737](https://www.bestpractices.dev/projects/13737) |
| `x-twitter-scraper-python` | [OpenSSF project 13738](https://www.bestpractices.dev/projects/13738) |
| `x-twitter-scraper-ruby` | [OpenSSF project 13739](https://www.bestpractices.dev/projects/13739) |
| `x-twitter-scraper-typescript` | [OpenSSF project 13740](https://www.bestpractices.dev/projects/13740) |
| `xquik-haystack` | [OpenSSF project 13741](https://www.bestpractices.dev/projects/13741) |

## Shared Evidence

These documents support repository-specific badge evidence:

- [Contribution requirements and DCO](CONTRIBUTING.md)
- [Governance and public roles](GOVERNANCE.md)
- [Code review requirements](REVIEWING.md)
- [Vulnerability response process](SECURITY.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Twelve-month roadmap](ROADMAP.md)

Repository-specific evidence must still prove the affected criterion.

## Verified Organization Controls

- GitHub requires two-factor authentication for organization members.
- Every public repository supports private vulnerability reporting.
- Seventeen standalone projects have current Passing badges.
- Seventeen standalone projects run required CI checks.

## Known Gold Gaps

The organization currently has one member.

It does not yet meet these Gold requirements:

- A bus factor of 2 or more.
- Two unassociated significant contributors per project.
- Verifiable independent review for 50% of released modifications.
- Complete per-file copyright and license notices.

These areas still need repository-specific verification:

- Reproducible builds.
- Statement and branch coverage.
- Signed release verification.
- Architecture, threat model, and assurance evidence.
- Human security reviews completed within 5 years.
- Dynamic analysis before major releases.

Never mark a criterion as met without current public evidence.

Review this register after repository, badge, or criteria changes.

Xquik is an independent third-party service. Not affiliated with X Corp. "Twitter" and "X" are trademarks of X Corp.
