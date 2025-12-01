import { TextDocument } from "vscode-languageserver-textdocument";
import {
  createConnection,
  Diagnostic,
  DiagnosticSeverity,
  ProposedFeatures,
  TextDocuments,
  TextDocumentSyncKind,
} from "vscode-languageserver/node";
import { Parser, VariableNode } from "../parser";
import { DocumentCache } from "./document-cache";

const cache = new DocumentCache();
const connection = createConnection(ProposedFeatures.all);

const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

connection.onInitialize((params) => ({
  capabilities: {
    textDocumentSync: TextDocumentSyncKind.Incremental,
  },
}));

documents.onDidChangeContent((event) => {
  cache.update(event.document.uri, event.document.getText());

  const ast = cache.get(event.document.uri)?.ast;
  if (!ast) return [];

  const diagnostics: Diagnostic[] = [];

  ast.walk((element) => {
    if (element instanceof VariableNode) {
      const diagnostic: Diagnostic = {
        severity: DiagnosticSeverity.Warning,
        range: {
          start: event.document.positionAt(element.name.start),
          end: event.document.positionAt(
            element.name.start + element.name.length
          ),
        },
        message: `Invalid variable name`,
        code: "100",
        source: "tui",
      };

      diagnostics.push(diagnostic);
    }
  });

  connection.sendDiagnostics({ uri: event.document.uri, diagnostics });
});

documents.listen(connection);
connection.listen();
