import { TextDocument } from "vscode-languageserver-textdocument";
import {
  CodeActionKind,
  createConnection,
  Diagnostic,
  ProposedFeatures,
  TextDocuments,
  TextDocumentSyncKind,
} from "vscode-languageserver/node";
import { DocumentCache } from "./document-cache";
import { HoverResolver } from "./hover-resolver";
import { Linter, LinterOptions } from "./linter";
import { Formatter, FormatterOptions } from "./formatter";
import { CodeActionProvider } from "./code-action-provider";

type ExtensionConfiguration = FormatterOptions & LinterOptions;
let extensionConfiguration: ExtensionConfiguration | undefined = undefined;

const cache = new DocumentCache();
const connection = createConnection(ProposedFeatures.all);

const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

connection.onInitialize((params) => ({
  capabilities: {
    textDocumentSync: TextDocumentSyncKind.Incremental,
    hoverProvider: true,
    documentFormattingProvider: true,
    codeActionProvider: {
      codeActionKinds: [CodeActionKind.QuickFix],
    },
  },
}));

connection.onInitialized(async (params) => {
  extensionConfiguration = await connection.workspace.getConfiguration(
    "vscode-tui-language-support",
  );
});

connection.onDidChangeConfiguration(async (params) => {
  extensionConfiguration = await connection.workspace.getConfiguration(
    "vscode-tui-language-support",
  );
});

connection.onHover((params) => {
  const document = documents.get(params.textDocument.uri);
  if (!document) return null;

  const offset = document.offsetAt(params.position);

  const ast = cache.get(document.uri)?.ast;
  if (!ast) return null;

  const hoverResolver = new HoverResolver();
  return hoverResolver.resolve(offset, ast);
});

connection.onDocumentFormatting((params) => {
  const document = documents.get(params.textDocument.uri);
  if (!document) return null;

  const ast = cache.get(document.uri)?.ast;
  if (!ast) return null;

  const formatter = new Formatter();
  const options: FormatterOptions = {
    "null-literal": extensionConfiguration?.["null-literal"] ?? "any",
    "table-literal": extensionConfiguration?.["table-literal"] ?? "any",
  };
  return formatter.format(document, ast, options);
});

documents.onDidChangeContent((event) => {
  cache.update(event.document.uri, event.document.getText());

  const ast = cache.get(event.document.uri)?.ast;
  if (!ast) return [];

  const options: LinterOptions = {};
  const diagnostics = new Linter().lint(event, ast, options);
  connection.sendDiagnostics({ uri: event.document.uri, diagnostics });
});

connection.onCodeAction((params) => {
  const document = documents.get(params.textDocument.uri);
  if (!document) return null;

  const ast = cache.get(document.uri)?.ast;
  if (!ast) return null;

  const diagnostics: Diagnostic[] = params.context.diagnostics;
  const codeActionProvider = new CodeActionProvider();
  return codeActionProvider.provide(diagnostics, document, ast);
});

documents.listen(connection);
connection.listen();
