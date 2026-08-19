import { TextDocument } from "vscode-languageserver-textdocument";
import {
  createConnection,
  ProposedFeatures,
  TextDocuments,
  TextDocumentSyncKind,
} from "vscode-languageserver/node";
import { DocumentCache } from "./document-cache";
import { HoverResolver } from "./hover-resolver";
import { Linter } from "./linter";

const cache = new DocumentCache();
const connection = createConnection(ProposedFeatures.all);

const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

connection.onInitialize((params) => ({
  capabilities: {
    textDocumentSync: TextDocumentSyncKind.Incremental,
    hoverProvider: true,
  },
}));

connection.onHover((params) => {
  const document = documents.get(params.textDocument.uri);
  if (!document) return null;

  const offset = document.offsetAt(params.position);

  const ast = cache.get(document.uri)?.ast;
  if (!ast) return null;

  const hoverResolver = new HoverResolver();
  return hoverResolver.resolve(offset, ast);
});

documents.onDidChangeContent((event) => {
  cache.update(event.document.uri, event.document.getText());

  const ast = cache.get(event.document.uri)?.ast;
  if (!ast) return [];

  const diagnostics = new Linter().lint(event, ast);
  connection.sendDiagnostics({ uri: event.document.uri, diagnostics });
});

documents.listen(connection);
connection.listen();
