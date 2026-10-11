# AGENTS.md

## GitHub

- Read issues and PRs with the `gh` CLI, not `webfetch` — GitHub web pages are mostly navigation boilerplate.
  - `gh issue view` fails on this repo (deprecated Projects classic). Use `gh api repos/PythooonUser/vscode-tui-language-support/issues/<n> --jq '{title,body,state,labels:[.labels[].name]}'`, and `gh api repos/PythooonUser/vscode-tui-language-support/issues/<n>/comments` for comments.
  - PRs work normally: `gh pr view <n> --comments`.

## Branches

- Issue work goes in a `feature/<issue number>-<slug>` branch off `main`, with a PR body that says `Closes #<issue>`.

## Checks

- CI runs `npm ci`, `npm run compile`, `npm run format` and `npm test` on every push to `main` and every pull request. Keep all of them green.
- Format the source with `npm run format:fix`; CI checks it with `npm run format`.

## Formatter options

- Adding a formatter option means touching all of these at once: `FormatterOptions` (`src/server/formatter.ts`), the `extensionConfiguration` read (`src/server/server.ts`), `contributes.configuration` (`package.json`), the README settings table, `CHANGELOG.md`, and fixtures in `test/formatter/`.
- Option keys are kebab-case; `"any"` means "leave it as written" and is the default value.
- `test/settings/settings.test.ts` fails when the option keys, the `package.json` schema and the README table drift apart.

## Formatter fixtures

- `test/formatter/<name>.tui` holds `# <fixture-name> {json options}` blocks; the expected output is `test/formatter/<fixture-name>.formatted.tui`.
- Regenerate fixtures with `npm run utils:formatter test/formatter/<name>.tui`, never by hand.
- Run one fixture with `npm test -- --grep <fixture-name>`; run the full `npm test` once before committing.
