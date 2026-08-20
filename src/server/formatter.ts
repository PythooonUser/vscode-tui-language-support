import { TextDocument, TextEdit } from "vscode-languageserver-textdocument";
import {
  NullLiteralNode,
  SourceDocumentNode,
  TableLiteralNode,
} from "../parser";

export type FormatterOptions = {
  "null-literal": "null" | "nil" | "any";
  "table-literal": "brace" | "bracket" | "any";
};

export class Formatter {
  public format(
    document: TextDocument,
    ast: SourceDocumentNode,
    options: FormatterOptions,
  ): TextEdit[] {
    const edits: TextEdit[] = [];

    ast.walk((element) => {
      if (element.kind === "NullLiteralNode") {
        const node = element as NullLiteralNode;

        let text: string | undefined;

        if (
          node.literal.kind === "NilKeyword" &&
          options["null-literal"] === "null"
        ) {
          text = "null";
        } else if (
          node.literal.kind === "NullKeyword" &&
          options["null-literal"] === "nil"
        ) {
          text = "nil";
        }

        if (text) {
          edits.push({
            newText: text,
            range: {
              start: document.positionAt(node.literal.start),
              end: document.positionAt(
                node.literal.start + node.literal.length,
              ),
            },
          });
        }
        return;
      }

      if (element.kind === "TableLiteralNode") {
        const node = element as TableLiteralNode;

        let leftDelimiter: string | undefined;
        let rightDelimiter: string | undefined;

        if (
          node.leftDelimiter.kind === "LeftBracketDelimiter" &&
          options["table-literal"] === "brace"
        ) {
          leftDelimiter = "{";
        } else if (
          node.leftDelimiter.kind === "LeftBraceDelimiter" &&
          options["table-literal"] === "bracket"
        ) {
          leftDelimiter = "[";
        }

        if (leftDelimiter) {
          edits.push({
            newText: leftDelimiter,
            range: {
              start: document.positionAt(node.leftDelimiter.start),
              end: document.positionAt(
                node.leftDelimiter.start + node.leftDelimiter.length,
              ),
            },
          });
        }

        if (
          node.rightDelimiter.kind === "RightBracketDelimiter" &&
          options["table-literal"] === "brace"
        ) {
          rightDelimiter = "}";
        } else if (
          node.rightDelimiter.kind === "RightBraceDelimiter" &&
          options["table-literal"] === "bracket"
        ) {
          rightDelimiter = "]";
        }

        if (rightDelimiter) {
          edits.push({
            newText: rightDelimiter,
            range: {
              start: document.positionAt(node.rightDelimiter.start),
              end: document.positionAt(
                node.rightDelimiter.start + node.rightDelimiter.length,
              ),
            },
          });
        }
        return;
      }
    });

    return edits;
  }
}
