# Two-Person Review Evidence

This ledger records OpenSSF Gold `two_person_review` evidence.

It covers every standalone Xquik-dev project.

The `.github` and `xquik-docs` repositories provide shared community and documentation surfaces.

They do not publish standalone software releases.

The project criterion does not apply to them separately.

## Audit Window

The review policy took effect on July 23, 2026.

The audit includes every default-branch commit since `2026-07-23T00:00:00Z`.

It uses these conservative rules:

- Count every default-branch commit as one modification.
- Count direct commits as unreviewed.
- Count each rebased commit when GitHub associates it with an approved pull request.
- Count a squash merge as one reviewed modification.
- Require a known author and approval from another human.
- Require that approval on the exact pull request head.
- Require the approval before the pull request merged.
- Ignore bot comments, automated reviews, dismissed reviews, and pending changes.

See the [code review policy](REVIEWING.md).

## July 25, 2026 Result

All 17 projects meet the required 50% threshold.

| Repository | Reviewed Commits | Total Commits | Ratio |
| --- | ---: | ---: | ---: |
| `hermes-tweet` | 5 | 7 | 71.4% |
| `n8n-nodes-xquik` | 4 | 5 | 80.0% |
| `paperclip-plugin-xquik` | 3 | 4 | 75.0% |
| `prefect-xquik` | 4 | 5 | 80.0% |
| `terraform-provider-x-twitter-scraper` | 13 | 14 | 92.9% |
| `tweetclaw` | 2 | 3 | 66.7% |
| `x-twitter-scraper` | 5 | 6 | 83.3% |
| `x-twitter-scraper-cli` | 12 | 13 | 92.3% |
| `x-twitter-scraper-csharp` | 10 | 12 | 83.3% |
| `x-twitter-scraper-go` | 9 | 10 | 90.0% |
| `x-twitter-scraper-java` | 14 | 15 | 93.3% |
| `x-twitter-scraper-kotlin` | 4 | 5 | 80.0% |
| `x-twitter-scraper-php` | 13 | 14 | 92.9% |
| `x-twitter-scraper-python` | 9 | 10 | 90.0% |
| `x-twitter-scraper-ruby` | 7 | 8 | 87.5% |
| `x-twitter-scraper-typescript` | 7 | 10 | 70.0% |
| `xquik-haystack` | 3 | 4 | 75.0% |

The audit intentionally retains unreviewed commits in every denominator.

## August 14, 2026 Current Result

Sixteen projects meet the required 50% threshold.

`x-twitter-scraper` has 10 reviewed commits among 24 commits, or 41.7%.

The verifier reports this gap without blocking unrelated changes.

Future non-author reviews must restore the threshold before the next major release.

## Reproduce the Audit

Run the verifier with a GitHub token that can read public pull requests:

```sh
GITHUB_TOKEN=... node scripts/check-review-evidence.mjs
```

The [public contract workflow](.github/workflows/public-contract.yml) runs it weekly.

The verifier reports every project below 50%.

It fails when the public repository inventory changes.

## Maintenance

- Keep exact-head review dismissal enabled.
- Require a non-author approval before every non-trivial merge.
- Review the ledger before each release.
- Update the audit window only with documented policy evidence.
- Never remove unreviewed commits to improve a ratio.

Xquik is an independent third-party service. Not affiliated with X Corp. "Twitter" and "X" are trademarks of X Corp.
