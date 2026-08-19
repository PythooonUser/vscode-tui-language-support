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
      if (!element.error) return;

      let start = element.start;
      let length = element.length;
      let message = `ERROR: ${element.error}`;

      if (element.error === "UnexpectedEndOfFile") {
        if (element.parent.kind === "StringLiteralNode") {
          message = "Terminate this string with a closing character.";
        } else if (element.kind === "Comment") {
          message = "Terminate this block comment with closing characters.";
        }
      }

      if (element.error === "SkippedToken") {
        message = `Remove the skipped token '${element.content}'.`;
      }

      if (element.error === "MissingToken") {
        message = `Provide the missing character '${element.kind}' here.`;

        if (element.kind === "Index") {
          message = "Provide a valid index here.";
        } else if (element.kind === "RightBracketDelimiter") {
          message = "Close this expression with the missing ']' character.";
        } else if (element.kind === "RightBraceDelimiter") {
          message = "Close this expression with the missing '}' character.";
        } else if (element.kind === "RightParenDelimiter") {
          message = "Close this expression with the missing ')' character.";
        } else if (
          element.kind === "LeftBraceDelimiter" &&
          element.parent.kind === "CompoundStatementNode"
        ) {
          message = "Expected statements enclosed by '{ }'.";
        } else if (element.kind === "Expression") {
          message = "Provide a valid expression here.";

          // const parent = element.getParentOfKind("IfStatementNode");
          // if (parent) {
          //   message = "Provide a valid condition for this if-statement.";
          //   start = (parent as IfStatementNode).condition.start;
          //   length = (parent as IfStatementNode).condition.length;
          // }
        }
      }

      const diagnostic: Diagnostic = {
        severity: DiagnosticSeverity.Error,
        range: {
          start: event.document.positionAt(start),
          end: event.document.positionAt(start + length),
        },
        message,
        code: "100",
        source: "tui",
      };

      diagnostics.push(diagnostic);
    });

    return diagnostics;
  }
}
