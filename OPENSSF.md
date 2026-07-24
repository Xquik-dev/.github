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

## July 25, 2026 Audit Snapshot

- Xquik-dev has 19 public repositories.
- Seventeen repositories are standalone software projects.
- All 17 live entries report Passing at 100%.
- Silver completion is 98% for every project.
- Gold completion ranges from 65% to 78%.
- All 55 Silver and 23 Gold fields have explicit classifications.
- No Silver or Gold field remains unknown.
- Every required Silver explanation and evidence URL is present.
- All 17 entries mark 4 verified human requirements as Unmet.
- Each entry includes dated remediation guidance for those requirements.
- All 17 entries mark cryptographic 2FA as Met.
- All 17 projects expose a scoped newcomer task.
- All 17 projects have verified signed release artifacts.
- All 17 software projects protect `v*` tags against destructive updates.
- All latest public Git tags remain unsigned.
- All 15 projects with qualifying fixes meet the six-month regression ratio.
- Two projects have no qualifying fixes and use `N/A`.
- All 17 projects meet the current 50% two-person-review threshold.

## Shared Evidence

These documents support repository-specific badge evidence:

- [Contribution requirements and DCO](CONTRIBUTING.md)
- [Governance and public roles](GOVERNANCE.md)
- [Code review requirements](REVIEWING.md)
- [Vulnerability response process](SECURITY.md)
- [Architecture and security assurance](ASSURANCE.md)
- [Release integrity and verification](RELEASES.md)
- [Debug-information preservation evidence](BUILD_DEBUG.md)
- [Six-month regression-test evidence](REGRESSION_TESTS.md)
- [Two-person review evidence](REVIEW_EVIDENCE.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Twelve-month roadmap](ROADMAP.md)

Repository-specific evidence must still prove the affected criterion.

## Newcomer Tasks

Each standalone project exposes one open, scoped task.

Every task has `good first issue` and `help wanted` labels.

| Repository | Task |
| --- | --- |
| `hermes-tweet` | [#611](https://github.com/Xquik-dev/hermes-tweet/issues/611) |
| `n8n-nodes-xquik` | [#12](https://github.com/Xquik-dev/n8n-nodes-xquik/issues/12) |
| `paperclip-plugin-xquik` | [#5](https://github.com/Xquik-dev/paperclip-plugin-xquik/issues/5) |
| `prefect-xquik` | [#16](https://github.com/Xquik-dev/prefect-xquik/issues/16) |
| `terraform-provider-x-twitter-scraper` | [#12](https://github.com/Xquik-dev/terraform-provider-x-twitter-scraper/issues/12) |
| `tweetclaw` | [#27](https://github.com/Xquik-dev/tweetclaw/issues/27) |
| `x-twitter-scraper` | [#20](https://github.com/Xquik-dev/x-twitter-scraper/issues/20) |
| `x-twitter-scraper-cli` | [#14](https://github.com/Xquik-dev/x-twitter-scraper-cli/issues/14) |
| `x-twitter-scraper-csharp` | [#20](https://github.com/Xquik-dev/x-twitter-scraper-csharp/issues/20) |
| `x-twitter-scraper-go` | [#15](https://github.com/Xquik-dev/x-twitter-scraper-go/issues/15) |
| `x-twitter-scraper-java` | [#15](https://github.com/Xquik-dev/x-twitter-scraper-java/issues/15) |
| `x-twitter-scraper-kotlin` | [#15](https://github.com/Xquik-dev/x-twitter-scraper-kotlin/issues/15) |
| `x-twitter-scraper-php` | [#13](https://github.com/Xquik-dev/x-twitter-scraper-php/issues/13) |
| `x-twitter-scraper-python` | [#19](https://github.com/Xquik-dev/x-twitter-scraper-python/issues/19) |
| `x-twitter-scraper-ruby` | [#18](https://github.com/Xquik-dev/x-twitter-scraper-ruby/issues/18) |
| `x-twitter-scraper-typescript` | [#16](https://github.com/Xquik-dev/x-twitter-scraper-typescript/issues/16) |
| `xquik-haystack` | [#5](https://github.com/Xquik-dev/xquik-haystack/issues/5) |

These tasks satisfy the Gold `small_tasks` evidence requirement.

## Verified Organization Controls

- GitHub requires two-factor authentication for organization members.
- The organization owner prefers a configured passkey for GitHub 2FA.
- An authenticator app provides an additional cryptographic 2FA method.
- SMS is not configured as a GitHub 2FA method.
- Every public repository supports private vulnerability reporting.
- Every default branch requires 1 current approval.
- The last pusher cannot provide that approval.
- Administrators cannot bypass required checks or reviews.
- Every default branch dismisses stale reviews and requires resolved conversations.
- Every default branch blocks force pushes and deletion.
- Seventeen standalone projects have current Passing badges.
- Seventeen standalone projects run required CI checks.

## Technical Baseline Adoption

These pull requests establish project-specific and shared technical controls.

| Repository | Pull Request | Status | Verified Scope |
| --- | --- | --- | --- |
| `.github` | [#2](https://github.com/Xquik-dev/.github/pull/2) | Merged | Shared governance, badge inventory, and public contract verification |
| `hermes-tweet` | [#610](https://github.com/Xquik-dev/hermes-tweet/pull/610) | Merged | License notices, tests, coverage, and package checks |
| `n8n-nodes-xquik` | [#11](https://github.com/Xquik-dev/n8n-nodes-xquik/pull/11) | Merged | License notices, tests, security checks, and reproducible packages |
| `paperclip-plugin-xquik` | [#4](https://github.com/Xquik-dev/paperclip-plugin-xquik/pull/4) | Merged | License notices, tests, security checks, and reproducible packages |
| `prefect-xquik` | [#15](https://github.com/Xquik-dev/prefect-xquik/pull/15) | Merged | License notices, tests, security checks, and reproducible packages |
| `terraform-provider-x-twitter-scraper` | [#11](https://github.com/Xquik-dev/terraform-provider-x-twitter-scraper/pull/11) | Merged | Coverage, race safety, notices, security, and reproducible releases |
| `tweetclaw` | [#21](https://github.com/Xquik-dev/tweetclaw/pull/21) | Merged | Security boundaries, tests, coverage, and public disclosures |
| `x-twitter-scraper` | [#19](https://github.com/Xquik-dev/x-twitter-scraper/pull/19) | Merged | Coverage, licensing, security, reproducibility, and disclosures |
| `x-twitter-scraper-cli` | [#13](https://github.com/Xquik-dev/x-twitter-scraper-cli/pull/13) | Merged | Coverage, notices, portability, and reproducible releases |
| `x-twitter-scraper-csharp` | [#19](https://github.com/Xquik-dev/x-twitter-scraper-csharp/pull/19) | Merged | Coverage, security fixes, licensing, and reproducible packages |
| `x-twitter-scraper-go` | [#14](https://github.com/Xquik-dev/x-twitter-scraper-go/pull/14) | Merged | Coverage, race tests, fuzzing, licensing, security, and reproducibility |
| `x-twitter-scraper-java` | [#14](https://github.com/Xquik-dev/x-twitter-scraper-java/pull/14) | Merged | Maintained coverage, fuzzing, security, licensing, and reproducibility |
| `x-twitter-scraper-kotlin` | [#14](https://github.com/Xquik-dev/x-twitter-scraper-kotlin/pull/14) | Merged | Generated-inclusive coverage, fuzzing, security, licensing, and reproducibility |
| `x-twitter-scraper-php` | [#12](https://github.com/Xquik-dev/x-twitter-scraper-php/pull/12) | Merged | Coverage, security fixes, licensing, and reproducible packages |
| `x-twitter-scraper-python` | [#18](https://github.com/Xquik-dev/x-twitter-scraper-python/pull/18) | Merged | Coverage, licensing, security, and reproducible packages |
| `x-twitter-scraper-ruby` | [#17](https://github.com/Xquik-dev/x-twitter-scraper-ruby/pull/17) | Merged | Coverage, licensing, reproducibility, and release verification |
| `x-twitter-scraper-typescript` | [#15](https://github.com/Xquik-dev/x-twitter-scraper-typescript/pull/15) | Merged | Coverage, licensing, security, and reproducible packages |
| `xquik-haystack` | [#4](https://github.com/Xquik-dev/xquik-haystack/pull/4) | Merged | License notices, regression tests, coverage, and reproducibility |
| `xquik-docs` | [#17](https://github.com/Xquik-dev/xquik-docs/pull/17) | Merged | Shared-site assurance, tests, integrity, licensing, and security |

All 19 baseline pull requests have merged.

Do not count pending changes as default-branch evidence.

Java [#17](https://github.com/Xquik-dev/x-twitter-scraper-java/pull/17)
records 94.05% generated-inclusive line coverage and 92.81% branch coverage.

Kotlin #14 records 92.70% generated-inclusive line coverage and 91.87% branch coverage.

TypeScript [#18](https://github.com/Xquik-dev/x-twitter-scraper-typescript/pull/18)
adds 2 regression guards.

Hermes [#612](https://github.com/Xquik-dev/hermes-tweet/pull/612)
and Paperclip [#6](https://github.com/Xquik-dev/paperclip-plugin-xquik/pull/6)
add reproducible-package evidence.

All 17 projects now have default-branch debug-preservation evidence.

Terraform [#14](https://github.com/Xquik-dev/terraform-provider-x-twitter-scraper/pull/14)
and CLI [#16](https://github.com/Xquik-dev/x-twitter-scraper-cli/pull/16)
merged independently reviewed verification.

See [debug-information evidence](BUILD_DEBUG.md) for the complete assessment.

## Other Open Pull Request Audit

- Core [#9](https://github.com/Xquik-dev/x-twitter-scraper/pull/9) remains a conflicting draft.
- Core [#10](https://github.com/Xquik-dev/x-twitter-scraper/pull/10) remains a behind-base draft.
- Both drafts contain explicit release blocks.
- Do not update, merge, tag, or publish either draft.
- Haystack [#6](https://github.com/Xquik-dev/xquik-haystack/pull/6) is an independent contribution for issue #5.
- Its added file passes Ruff, and all 18 unit tests pass locally.
- Contributor commit `faf5d270` lacks the required DCO sign-off.
- The contributor must amend and re-push it before this PR qualifies as evidence.
- Required remote checks pass with zero unresolved review threads.
- A new independent approval will be required after the contributor's push.

## README & Repository Metadata

All 19 public repository READMEs were audited on July 24, 2026.

All default branches contain the approved independence disclosure.

All 19 default branches contain the exact unformatted footer.

All repository descriptions identify their supported purpose.

All descriptions include the compact independence notice.

Topics remain specific to supported languages, workflows, and customer tasks.

Every public repository now includes the `xquik` discovery topic.

Descriptions contain 94 to 140 characters.

Each opening sentence contains 9 to 14 words.

Each repository uses 14 to 20 accurate topics.

The public contract check now preserves these discovery requirements:

- One clear README title and at least 3 descriptive sections.
- A task-oriented section and copyable example for each project repository.
- Descriptive link text and alternative text for images.
- An HTTPS homepage and a concise repository description.
- The `xquik` topic and at least one supported customer-intent topic.
- No more than 20 repository topics.

These checks favor useful structure and accurate terms.

They do not require keyword lists or duplicate questions.

## Known Gold Gaps

A second reviewer has repository write access.

Public evidence still does not prove full release and legal continuity.

The projects do not yet meet this required Silver prerequisite:

- Continuity after the loss of any one project member.

They do not yet meet these human Gold requirements:

- A bus factor of 2 or more.
- Two unassociated significant contributors per project.
- A human security review completed within the last 5 years.

Open remediation pull requests cannot satisfy these human requirements.

Track human prerequisites in [organization issue #3](https://github.com/Xquik-dev/.github/issues/3).

Track the maintainer nomination in [organization issue #8](https://github.com/Xquik-dev/.github/issues/8).

Track scoped human reviews in [organization issue #5](https://github.com/Xquik-dev/.github/issues/5).

All 17 projects now have project-controlled release signature evidence.

Never mark a criterion as met without current public evidence.

Review this register after repository, badge, or criteria changes.

Xquik is an independent third-party service. Not affiliated with X Corp. "Twitter" and "X" are trademarks of X Corp.
