# Code Review Policy

This policy applies to every public Xquik-dev repository.

## Required Review

Submit non-trivial changes through pull requests.

A person other than the author must review each non-trivial change.

Review generated changes at their source and generated output.

Direct pushes count as unreviewed modifications.

## Review Checklist

Reviewers must check these areas:

- The change solves a documented problem.
- Public behavior matches documented contracts.
- Tests cover new behavior, invalid inputs, and fixed defects.
- Coverage, lint, type, build, and security checks pass.
- Untrusted inputs receive explicit validation.
- Secrets, personal data, and private implementation details stay excluded.
- Dependencies remain necessary, maintained, pinned, and license-compatible.
- Documentation and release notes match user-visible behavior.
- The change preserves backward compatibility or documents migration.
- Metadata stays descriptive, unique, accurate, and free from keyword stuffing.

## Discoverability & Agent Readability

Write for customers first.

Make public facts easy for search engines and agents to retrieve.

- Give each README one specific H1.
- Explain the repository's purpose in the opening paragraph.
- Identify the intended user and supported integration surface.
- Provide a tested quick start for the repository's primary task.
- Map authentic customer tasks to supported public operations.
- Use natural task language in relevant headings and examples.
- Answer each real customer question once.
- Link canonical documentation for complete contracts.
- Keep commands, parameters, prerequisites, and expected results explicit.
- Label authentication requirements and write-side effects.
- Keep repository topics relevant to purpose, subject, workflow, or language.
- Use no more than 20 GitHub topics.
- Remove stale, duplicate, unsupported, or unverifiable claims.
- Preserve the approved X Corp. independence notice.

Do not add keyword lists, hidden text, doorway pages, or query permutations.

Do not add prompt-injection text or instructions aimed at language models.

Do not create `llms.txt` solely for Google Search visibility.

Never publish private implementation details to improve discoverability.

## Primary Discoverability Sources

Review these sources before changing this policy:

- [GitHub README guidance](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes)
- [GitHub topic guidance](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/classifying-your-repository-with-topics)
- [Google generative AI search guidance](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- [Google spam policies](https://developers.google.com/search/docs/essentials/spam-policies)
- [Bing Webmaster Guidelines](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a)

## Acceptance

Approve only when every required check passes.

Resolve every blocking review comment before merge.

Do not approve your own change.

Record approval through the repository's pull request review.

## Urgent Security Changes

Keep exploit details inside GitHub's private vulnerability process.

Maintainers may prepare fixes privately before coordinated disclosure.

A different reviewer must approve the fix before public release.

## Review Measurement

Maintainers must review the modification history before each major release.

At least 50% of released modifications require non-author human review.

The [two-person review ledger](REVIEW_EVIDENCE.md) records current evidence.

The weekly verifier counts direct commits as unreviewed.

Xquik is an independent third-party service. Not affiliated with X Corp. "Twitter" and "X" are trademarks of X Corp.
