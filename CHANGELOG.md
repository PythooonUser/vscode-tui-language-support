# Changelog

All notable changes to the "vscode-tui-language-support" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.9.2] - 2026-10-22

### Added

- `require` linting is back: the linter checks whether a `require` path resolves to a file, relative to the current document
- New `require-search-paths` setting: additional directories that are searched for `require` files, too; `require` paths given relative are resolved against the current document and these directories, while `require` paths starting with `/` are only checked as absolute paths

## [0.9.1] - 2026-10-20

### Removed

- `require` linting was not taking into account a custom base path that can be set - disabled for now

## [0.9.0] - 2026-10-14

### Added

- Formatting is now available for assignment tokens: the new `assignment-token` setting normalizes the assignment token (`=` or `:`)
- Formatting is now available for table literal key names: the new `table-key` setting normalizes keys between bare (`foo`) and quoted (`"foo"`) form; keys that cannot be represented as a bare name are left unchanged
- `require` will now validate simple URIs and emit a diagnostic if file is not found

## [0.8.0] - 2026-09-18

### Added

- Linter recognized global `load` function

### Fixed

- Escaped `\` character now correctly handled (fixes #23)

## [0.7.0] - 2026-09-03

### Added

- Quoted table keys are now properly linted and define symbols in the scope
- New syntax `# global foo1 foo2` or `// global foo1 foo2` can be used to define globals for a specific file
- Quick Fix action for adding an undefined symbol to the global comment

### Removed

- The "globals" VSCode setting is replaced with the in-file comment annotation

## [0.6.0] - 2026-09-01

### Added

- The character escape sequence `\n` is now highlighted
- New settings option for defining globals (symbols) the linter can use

### Updated

- Enabled linting of undefined variables (still experimental)

## [0.5.0] - 2026-08-31

### Added

- Parsing of `break` statement
- Checking of undefined variables (disabled, experimental)
- Modulo `%` operator
- The character escape sequence `\t` is now highlighted

### Fixed

- Unary minus `-a` is no longer reported as a syntax error

## [0.4.0] - 2026-08-20

### Added

- Basic formatting support for nullable types and table literals
- Formatter configuration options

## [0.3.1] - 2026-08-19

### Fixed

- Apparently, we need `node_modules` to be published inside the extension

## [0.3.0] - 2026-08-19

### Added

- Lexer and Parser for `tui` source code
- Syntax Highlighting for language keywords `and`, `or` and `while`
- Syntax Highlighting for block comments
- Diagnostics for token errors per file
- Basic Hover Support for symbols

## [0.2.1] - 2025-05-14

### Fixed

- Prevented build artifacts from being included in the published extension

## [0.2.0] - 2025-05-14

### Added

- Syntax Highlighting for `in` operator inside `for`-loops

## [0.1.0] - 2025-04-30

### Added

- Language Configuration
- Syntax Highlighting
