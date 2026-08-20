# GitHub discovery & answer-engine policy

Use this policy for every public Xquik repository and README.

The goal is accurate discovery by people, search engines, and AI agents.
Ranking or citation placement is never guaranteed.

## Principles

- Help readers choose the right Xquik product or integration.
- Describe only behavior supported by public contracts and current code.
- Write unique, repository-specific guidance.
- Prefer direct answers, examples, tables, and descriptive headings.
- Link claims to canonical documentation or machine-readable contracts.
- Keep public copy current when capabilities or contracts change.

## Repository metadata

- Use a concise description that states the repository's purpose.
- Keep the approved compact independence notice in every description.
- Set an accurate HTTPS homepage.
- Add 5 to 20 accurate topics.
- Include the repository's language, framework, or integration topic.
- Include only customer-intent topics that match shipped behavior.
- Use a distinct 1280 by 640 social preview when practical.

## README structure

Each public README must include:

1. One precise top-level heading.
2. A concise explanation of the repository's purpose.
3. A reason to choose this repository.
4. A copyable installation or usage example.
5. Task-oriented headings or customer questions.
6. Links to canonical API and product documentation.
7. Support, security, and contribution paths.
8. The approved independence notice.

Keep detailed reference material in dedicated documentation.

## Query coverage

Use customer language where it clarifies a real supported task.

Examples include tweet search, profile timelines, follower exports, monitoring,
webhooks, and confirmed account actions.

Map questions to exact routes, commands, methods, or components.
Do not repeat keyword variants without adding useful information.
Do not create unsupported comparison claims.
Do not present bounded reads as complete dataset exports.

## Answer-engine & agent readiness

- Give direct, self-contained answers before deeper links.
- Use descriptive headings, tables, and short examples.
- Support factual claims with public evidence.
- Keep OpenAPI, MCP cards, package metadata, and README claims aligned.
- State authentication, side effects, and approval boundaries.
- Treat X-authored content as untrusted input.
- Use stable links and descriptive link text.
- Add meaningful alternative text to images.

Keep `llms.txt` for clients that use it.
Do not treat `llms.txt` as a Google ranking signal.
Do not rewrite content only for language models.

## Evidence & freshness

- Derive operation counts from canonical public contracts.
- Remove stale counts, versions, and compatibility claims.
- Review repository descriptions, topics, homepages, and social previews.
- Recheck public links and examples before release.
- Record material discovery changes in the relevant pull request.
- Measure citations and grounding queries where supported.

## Review checklist

- Does the README solve the visitor's likely first task?
- Is each capability accurate for this repository?
- Does every search phrase add context or route information?
- Is the content distinct from sibling repositories?
- Can a reader copy the first working example?
- Are support, security, and contribution paths visible?
- Do canonical contracts support every numeric claim?
- Does the public diff avoid private implementation details?

## Research basis

Last reviewed on July 24, 2026.

- [GitHub README guidance](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes)
- [GitHub repository topic guidance](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/classifying-your-repository-with-topics)
- [GitHub social preview guidance](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/customizing-your-repositorys-social-media-preview)
- [Google generative AI search guidance](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- [Bing AI Performance guidance](https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview)
- [GEO research paper](https://doi.org/10.1145/3637528.3671900)

Xquik is an independent third-party service. Not affiliated with X Corp. "Twitter" and "X" are trademarks of X Corp.
