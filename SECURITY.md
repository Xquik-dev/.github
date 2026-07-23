# Security Policy

## Reporting a Vulnerability

Report vulnerabilities through the affected repository's private reporting option.

Use [security@xquik.com](mailto:security@xquik.com) when private reporting is unavailable.

Never post exploit details through public channels.

Never post credentials, cookies, webhook secrets, account identifiers, or private routing details.

Remove personal data from screenshots before sharing.

Open a minimal public issue only when both private channels fail.

State that a private security channel is required.

Never include technical details in that issue.

## Include

- The affected repository and version.
- A clear impact description.
- Reproduction steps or a minimal proof.
- Required access or configuration.
- Suggested remediation, when available.

Do not include real credentials, tokens, cookies, or personal data.

## Scope

This policy covers public Xquik-dev repositories, SDKs, skills, docs, plugins, examples, and package metadata.

Use normal GitHub issues for public, non-security defects.

## Response Process

Maintainers will acknowledge reports within 3 business days.

Maintainers will validate and classify reports within 14 days.

Maintainers will fix confirmed public vulnerabilities within 60 days.

Critical vulnerabilities receive immediate priority.

Maintainers will coordinate disclosure timing with the reporter.

Maintainers will publish advisories and fixed versions when appropriate.

## Reporter Credit

Public advisories will credit every reporter unless they request anonymity.

## Shared Security Requirements

Public projects must follow these requirements:

- Use HTTPS and TLS 1.2 or newer for network communications.
- Verify TLS certificates before sending credentials or private information.
- Reject plaintext service endpoints by default.
- Keep credentials outside source code, configuration examples, and logs.
- Validate untrusted inputs against explicit allowed formats.
- Apply least privilege to workflows, tokens, and application permissions.
- Pin automated workflow dependencies to immutable revisions.
- Monitor dependencies and resolve exploitable vulnerabilities.
- Require tests for corrected vulnerabilities.
- Run static and dynamic checks before major releases.

Each repository must document its specific boundary and threat model.

## Disclosure

Avoid public disclosure before a fix becomes available.

Release notes must identify corrected public vulnerabilities.

Security advisories must include affected and fixed versions.

Xquik is an independent third-party service. Not affiliated with X Corp. "Twitter" and "X" are trademarks of X Corp.
