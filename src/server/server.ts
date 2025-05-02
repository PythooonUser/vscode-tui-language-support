import { TextDocument } from "vscode-languageserver-textdocument";
import {
  createConnection,
  ProposedFeatures,
  TextDocuments,
  TextDocumentSyncKind,
} from "vscode-languageserver/node";

const connection = createConnection(ProposedFeatures.all);

const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

connection.onInitialize((params) => ({
  capabilities: {
    textDocumentSync: TextDocumentSyncKind.Incremental,
  },
}));

documents.onDidChangeContent((event) => {
  console.log(
    `${event.document.uri} (${event.document.languageId} ${event.document.version})`
  );
});

documents.listen(connection);
connection.listen();
