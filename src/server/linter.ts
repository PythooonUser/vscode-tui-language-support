import { TextDocument } from "vscode-languageserver-textdocument";
import {
  Diagnostic,
  DiagnosticSeverity,
  TextDocumentChangeEvent,
} from "vscode-languageserver/node";
import { SourceDocumentNode } from "../parser";

export class Linter {
  public lint(
    event: TextDocumentChangeEvent<TextDocument>,
    ast: SourceDocumentNode,
  ): Diagnostic[] {
    const diagnostics: Diagnostic[] = [];

    ast.walk((element) => {
      if (element.error) {
        let message = `ERROR: ${element.error}`;

        if (element.error === "UnexpectedEndOfFile") {
          if (element.parent.kind === "StringLiteralNode") {
            message = "Terminate this string with a closing character.";
          }
        }

        const diagnostic: Diagnostic = {
          severity: DiagnosticSeverity.Error,
          range: {
            start: event.document.positionAt(element.start),
            end: event.document.positionAt(element.start + element.length),
          },
          message,
          code: "100",
          source: "tui",
        };

        diagnostics.push(diagnostic);
      }
    });

    return diagnostics;
  }
}
