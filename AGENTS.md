# Agent OnBoarding: vscode-tui-language-support

This VS Code extension adds language support for the **tui** programming language (see https://github.com/mjdave/tui). This guide provides essential context for AI agents working on this codebase.

## Project Architecture

The project follows a **client-server** architecture:

- **Client** (`src/client/client.ts`): VS Code extension entry point that loads the language server
- **Server** (`src/server/server.ts`): Language server providing diagnostics, hover information, and other editor features
- **Parser** (`src/parser/`): Core compilation pipeline (lexer → parser → AST)

### Critical Data Flow

```
Source Code → Lexer (tokenization) → Parser (AST generation) → Linter (diagnostics) → Server (diagnostics/hover/other)
```

The server caches parsed ASTs in `DocumentCache` and updates on document changes. All AST nodes implement a `walk()` method for tree traversal during error reporting.

## Parser Architecture

### Lexer (`src/parser/lexer.ts`)

- Converts source text into tokens, categorized as: operators, delimiters, keywords, names, numbers, strings
- Tracks trivia (whitespace, comments) separately from tokens
- Maps defined in `token-kind.ts`: `OperatorTokenMap`, `DelimiterTokenMap`, `KeywordTokenMap`

### Parser (`src/parser/parser.ts`, 897 lines)

- Recursive descent parser with operator precedence/associativity handling
- Uses `ParseContext` to track parsing state and error recovery
- **Entry point**: `parseSourceDocument(document: string): SourceDocumentNode`
- Expression parsing uses precedence climbing algorithm (`OperatorPrecedenceAndAssociativityMap`)
- All binary operators defined: `+`, `-`, `*`, `/`, `>`, `>=`, `<`, `<=`, `==`, `!=`, `in`, `&&`, `||`

### AST Nodes (`src/parser/nodes/`)

- All nodes extend `Node` base class (defined in `node.ts`)
- Each node has: `kind`, `error` (nullable), positional info (`start`, `length`)
- Parent references are stripped during serialization for testing
- Key pattern: nodes track their child elements as typed properties (e.g., `BinaryExpressionNode` has `leftOperand`, `operator`, `rightOperand`)

## Testing Architecture

Tests use a **snapshot-based pattern** (similar to snapshot testing):

1. **Source files** (`.tui`): Multiple test cases defined as markdown-like sections

   - Format: `# test-name` followed by code snippet
   - Example: `test/parser/parser/binary-expression.tui`

2. **Expected outputs** (`.tui.json`): Parser's output for each test case
   - Generated via `npm run utils:parser <file.tui>`
   - Contains serialized AST (excludes `parent`, `trivia`, `document` properties)
   - Location: `test/parser/parser/<test-name>.tui.json`

Same applies for the lexer, linting diagnostics, etc.

### Test Workflow

```bash
npm test                                                    # Run all tests
npm run utils:parser test/parser/parser/binary-expression.tui  # Regenerate expected outputs
```

When adding a test case:

1. Add `# new-test-name` + code snippet to source `.tui` file
2. Run `npm run utils:parser test/parser/parser/<category>.tui` to generate JSON
3. Tests auto-discover test cases from `.tui` files and compare against JSON

**Important**: The test runner dynamically parses `.tui` files and looks for corresponding `.tui.json` files. Missing JSON files cause test failures with helpful error messages indicating the `npm run utils:parser` command to run.

## Key Patterns & Conventions

### Error Handling

- Every node or token has a nullable `error` field (TokenError or ParseContextError)
- Errors contain: `message`, `start`, `length`

### Token Positioning

- All tokens/nodes store `start` (byte offset) and `length` (in bytes)
- Used for hover resolution: find node at document offset, return hover info

### AST Navigation

All nodes implement `walk(callback)` for tree traversal. The server uses this to:

- Collect all errors in a document
- Report diagnostics with proper positioning

## Build & Development Commands

```bash
npm run compile        # TypeScript compilation (tsc)
npm test              # Run all tests with Mocha
npm run utils:lexer   # Debug lexer output: node --require ts-node/register ./tools/lexer-utils.ts
npm run utils:parser  # Generate expected test outputs
```

## File Organization

```
src/
  client/client.ts              # VS Code extension entry
  server/
    server.ts                   # Language server (diagnostics, hover)
    document-cache.ts           # Caches parsed ASTs per document URI
    hover-resolver.ts           # Implements hover support
  parser/
    parser.ts                   # Core recursive descent parser
    lexer.ts                    # Tokenizer
    token.ts, token-kind.ts     # Token definitions
    token-error.ts              # Token-level errors
    parse-context.ts            # Parser state tracking
    parse-context-error.ts      # Parse-level errors
    operator-precedence-associativity.ts  # Precedence/associativity rules
    nodes/                      # All AST node types (~30 files)
      node.ts                   # Base node class
      {statement,expression,...}-node.ts  # Concrete node types
test/
  parser/
    parser.test.ts              # Main test runner
    parser/                     # Test cases & expected outputs
      <category>.tui            # Source test cases
      <category>-<n>.tui.json   # Expected AST outputs
```

## Common Tasks for Agents

### Adding a Language Feature

1. **Lexer**: Add token type to `TokenKind` in `token-kind.ts` if needed
2. **Parser**: Add parsing logic in `parser.ts`; create corresponding node in `nodes/`
3. **Tests**: Add test case to appropriate `.tui` file; run `npm run utils:parser` to generate expected output
4. **Server**: Add diagnostics/hover support if needed in `server.ts` or `hover-resolver.ts`

### Fixing Parser Bugs

1. Add failing test case to `.tui` file
2. Run `npm run utils:parser` to capture actual output (temporarily)
3. Verify output is wrong (AST structure issue)
4. Fix parser logic in `parser.ts`
5. Re-run `npm run utils:parser` to generate correct expected output
6. Verify `npm test` passes

### Adding Diagnostics

1. Define error condition in `parse-context.ts` or parser logic
2. Set `error` property on node with `new ParseContextError(...)`
3. Server's `ast.walk()` collects and reports via `onDidChangeContent`

## Critical Implementation Details

- **Operator precedence**: Defined in `OperatorPrecedenceAndAssociativityMap`; used during expression parsing
- **Recursive descent**: Parser uses method per grammar rule (e.g., `parseExpression`, `parseStatement`)
- **Document URIs**: Server uses VS Code document URIs as cache keys (e.g., `file:///path/to/file.tui`)
- **Incremental sync**: Server configured for `TextDocumentSyncKind.Incremental` (only changed portions sent)

## TypeScript Configuration

- **Strict mode enabled**: All strict compiler checks active
- **Target**: ES6
- **ts-node**: Configured with `transpileOnly: true` for fast test execution
