import { TextDocument } from "vscode-languageserver-textdocument";
import {
  Diagnostic,
  DiagnosticSeverity,
  TextDocumentChangeEvent,
} from "vscode-languageserver/node";
import { Node, SourceDocumentNode, VariableNode } from "../parser";
import { Scope } from "../parser/scope";
import { Symbol } from "../parser/symbol";

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

    this.checkForUndefinedSymbols(event, ast, diagnostics);

    return diagnostics;
  }

  private checkForUndefinedSymbols(
    event: TextDocumentChangeEvent<TextDocument>,
    ast: SourceDocumentNode,
    diagnostics: Diagnostic[],
  ) {
    const languageScope = new Scope();
    languageScope.define(new Symbol("print"));
    languageScope.define(new Symbol("error"));
    languageScope.define(new Symbol("exit"));
    languageScope.define(new Symbol("readValue"));
    languageScope.define(new Symbol("clear"));
    languageScope.define(new Symbol("system"));
    languageScope.define(new Symbol("platform"));
    languageScope.define(new Symbol("require"));
    languageScope.define(new Symbol("type"));
    languageScope.define(new Symbol("debug"));
    languageScope.define(new Symbol("table"));
    languageScope.define(new Symbol("string"));
    languageScope.define(new Symbol("file"));
    languageScope.define(new Symbol("math"));

    const documentScope = ast.scope;
    documentScope.parent = languageScope;
    ast.scope = languageScope;

    ast.walk((nodeOrToken) => {
      if (nodeOrToken instanceof Node && nodeOrToken.kind === "VariableNode") {
        const symbol = nodeOrToken as VariableNode;
        if (!symbol.scope.lookup(symbol.name.content)) {
          const diagnostic: Diagnostic = {
            severity: DiagnosticSeverity.Warning,
            range: {
              start: event.document.positionAt(symbol.name.start),
              end: event.document.positionAt(
                symbol.name.start + symbol.name.length,
              ),
            },
            message: `Undefined symbol '${symbol.name.content}'.`,
            code: "undefined-symbol",
            source: "tui",
          };

          diagnostics.push(diagnostic);
        }
      }
    });
  }
}
