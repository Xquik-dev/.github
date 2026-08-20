# Public project architecture & security assurance

This assurance case covers every standalone public Xquik-dev project.

It documents shared architecture, trust boundaries, threats, controls, and residual risks.

Repository evidence must still prove each project-specific claim.

## Project architecture

Public projects use this common request flow:

1. A caller supplies task parameters and credentials.
2. The project maps inputs into a documented Xquik request.
3. A maintained runtime sends the request through HTTPS.
4. The project parses the documented public response.
5. The caller controls storage, display, and downstream use.

The hosted Xquik service has a separate operational boundary.

Public repositories exclude its private implementation and infrastructure.

### Project families

| Projects | Released components | Primary boundary |
| --- | --- | --- |
| `hermes-tweet`, `n8n-nodes-xquik`, `paperclip-plugin-xquik`, `prefect-xquik`, `tweetclaw`, `xquik-haystack` | Host adapter, configuration mapping, client call, and response mapping | Host runtime to the public Xquik API |
| `terraform-provider-x-twitter-scraper` | Provider configuration, resources, data sources, API client, and state mapping | Terraform configuration and state to the public Xquik API |
| `x-twitter-scraper` | Skill instructions, MCP tools, request schemas, and client operations | Agent host or MCP caller to the public Xquik API |
| `x-twitter-scraper-cli` | Command parser, API client, output formatter, and release binary | Local process to the public Xquik API |
| `x-twitter-scraper-csharp`, `x-twitter-scraper-go`, `x-twitter-scraper-java`, `x-twitter-scraper-kotlin`, `x-twitter-scraper-php`, `x-twitter-scraper-python`, `x-twitter-scraper-ruby`, `x-twitter-scraper-typescript` | Service facades, request models, transport, response models, and errors | Application process to the public Xquik API |

Generated SDK files mirror the public API contract.

Maintained runtime code owns transport and safety behavior.

Package managers own dependency resolution and installation.

GitHub Actions owns public build, test, analysis, and release automation.

### Trust boundaries

| Boundary | Untrusted input | Required handling |
| --- | --- | --- |
| Caller to project | Arguments, identifiers, URLs, files, and output options | Apply available type, schema, range, and format checks |
| Project to network | Base URL, headers, credentials, and request bodies | Default to HTTPS and verify TLS certificates |
| Network to project | Status codes, headers, JSON, text, and files | Parse defensively and bound retry behavior |
| Project to host | Returned records, files, logs, and errors | Preserve documented types and avoid secret disclosure |
| Source to release | Dependencies, generators, workflows, and artifacts | Pin, review, scan, test, and verify outputs |

Applications remain responsible for their own authorization and data retention.

Callers must protect exported data and credentials.

## Security requirements

The shared [security policy](SECURITY.md) defines response and disclosure requirements.

Each public project must preserve these claims:

| Claim | Required property |
| --- | --- |
| Credential confidentiality | Credentials stay outside source, URLs, outputs, and ordinary logs |
| Secure transport | Default endpoints use HTTPS with TLS 1.2 or newer |
| Certificate verification | Maintained runtimes verify certificates before sending credentials |
| Contract integrity | Requests and responses follow documented public schemas |
| Input safety | Restricted inputs use positive type, range, or format checks |
| Output safety | Remote content remains data and is never executed implicitly |
| Supply-chain integrity | Dependencies and workflows remain reviewable, pinned, and scanned |
| Release integrity | Published artifacts remain reproducible and cryptographically verifiable |

### Repository access assurance

GitHub requires 2FA for all organization members.

On July 24, 2026, the sole maintainer verified these account settings:

- 2FA is enabled.
- A passkey is configured and preferred.
- An authenticator app is configured.
- SMS is not configured.

These controls satisfy `require_2FA` and `secure_2FA`.

Reverify them after any organization membership or authentication change.

## Threat model

### Protected assets

- API credentials and authorization headers
- Customer-selected identifiers and exported records
- Public API and package contracts
- Source, workflows, tags, and release artifacts
- Vulnerability reports before coordinated disclosure

### Threat actors

- A caller supplying malformed or hostile input
- A remote endpoint returning malformed content
- A compromised or obsolete dependency
- A malicious contribution or workflow change
- A compromised distribution path
- An accidental maintainer error

### Threats & controls

| Threat | Primary controls | Residual risk |
| --- | --- | --- |
| Credential disclosure | Separate configuration, HTTPS defaults, redaction, and review | Host applications can still log or expose supplied credentials |
| Endpoint redirection | Trusted defaults, certificate verification, and redirect guards | Explicit caller overrides can choose a less safe endpoint |
| Malformed remote data | Typed decoding, schema tests, bounds, and generic errors | Callers must safely handle returned content |
| Resource exhaustion | Bounded retries, capped delays, timeouts, and pagination controls | Large requested exports still consume caller resources |
| Dependency compromise | Lock data, Dependabot, audits, CodeQL, and least privilege | Newly disclosed vulnerabilities need timely remediation |
| Workflow compromise | Immutable action pins, restricted permissions, and required review | The sole maintainer remains an access-continuity risk |
| Artifact substitution | Reproducibility, checksums, provenance, and signing | Public verification remains incomplete for some projects |

## Secure design argument

The projects apply these secure-design principles:

- Fail-safe defaults use HTTPS and maintained certificate verification.
- Least privilege limits workflow permissions and credential scope.
- Complete mediation routes network access through maintained transports.
- Economy of mechanism relies on standard runtimes and package managers.
- Separation keeps credentials outside source and ordinary configuration examples.
- Open design keeps public contracts, checks, and security policies reviewable.

The current evidence register links each pending technical control.

See [OpenSSF Best Practices evidence](OPENSSF.md).

## Common weakness countermeasures

| Weakness | Countermeasure |
| --- | --- |
| CWE-20 improper input validation | Typed request models, schema checks, range checks, and regression tests |
| CWE-200 information exposure | Secret-free examples, redaction, generic errors, and private reporting |
| CWE-400 uncontrolled resource consumption | Retry caps, bounded delays, pagination, and timeout controls |
| CWE-601 open redirect | Maintained transports restrict credential-forwarding redirects |
| CWE-829 untrusted components | Machine-readable dependencies, lock data, audits, and update automation |
| CWE-918 server-side request forgery | Trusted default endpoints and isolated network tests |

Not every weakness applies to every project family.

Repository tests must demonstrate each applicable countermeasure.

## Assurance status

Passing badges and public policies provide baseline evidence.

Ready remediation pull requests provide verified technical evidence.

Pending changes do not count as default-branch evidence.

The organization still lacks required continuity and independent human evidence.

Release signing and 6-month regression ratios also need complete public proof.

Never claim Silver or Gold while a mandatory criterion remains unmet.

## Maintenance

Run repository checks before every release.

Reassess threats after public contract or trust-boundary changes.

Review this case after incidents, vulnerabilities, and major releases.

Update badge answers only from public default-branch evidence.

Xquik is an independent third-party service. Not affiliated with X Corp. "Twitter" and "X" are trademarks of X Corp.
