# Changelog

All notable changes to the "vscode-tui-language-support" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
