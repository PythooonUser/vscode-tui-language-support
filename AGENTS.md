# AGENTS

## Purpose

This repository provides Visual Studio Code language support for the `tui` language. It includes:

- Syntax highlighting
- A parser and AST for `tui`
- A Language Server implementing common editor features (hover, diagnostics, completions, etc.)

## Useful commands

Install dependencies:

```bash
npm install
```

Compile TypeScript:

```bash
npm run compile
```

Run tests:

```bash
npm test
```

Helper utilities:

```bash
npm run utils:lexer   # generate lexer fixtures
npm run utils:parser  # generate parser fixtures
```

## Project architecture

- **Client** (`src/client`) — VS Code client entrypoint and client-side integration for the language server (e.g. `client.ts`).
- **Server** (`src/server`) — Language Server implementation, request handlers, and helpers (e.g. `server.ts`, `document-cache.ts`, `hover-resolver.ts`).
- **Parser** (`src/parser`) — Lexer, Parser, AST node definitions, error types and utilities (key files: `lexer.ts`, `parser.ts`, `token.ts`, `node-*`, `nodes/*`).
- **Grammars / Config** — `syntaxes/tui.tmLanguage.json` and `language-configuration.json` for editor tokenization and bracket/comment rules.

## How tests are structured

- Tests are located under the `test/` directory.
- Lexer and parser unit tests live in `test/lexer/` and `test/parser/` and use `.tui` fixtures alongside `.json` expectation files.
- Tests are executed with Mocha and `ts-node` (see the `test` script in `package.json`).

## Notes & tips

- The project compiles to `dist/`; built files are referenced from the `main` field in `package.json`.
- Use the tools in the `tools/` folder to regenerate or inspect lexer/parser fixtures when updating the grammar or tokenization.
- When changing diagnostics or parser behavior, add or update fixtures under `test/parser/`.
