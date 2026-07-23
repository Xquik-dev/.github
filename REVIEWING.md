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

At least 50% of released modifications require independent author review.

The organization does not claim this threshold without verifiable pull request evidence.

Xquik is an independent third-party service. Not affiliated with X Corp. "Twitter" and "X" are trademarks of X Corp.
