import { TextDocument, TextEdit } from "vscode-languageserver-textdocument";
import {
  NullLiteralNode,
  SourceDocumentNode,
  TableLiteralNode,
} from "../parser";

export type FormatterOptions = {
  "null-literal": "null" | "nil" | "any";
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

        let text = node.literal.content;

        if (
          node.literal.kind === "NilKeyword" &&
          options["null-literal"] === "null"
        ) {
          text = "null";
        }

        if (
          node.literal.kind === "NullKeyword" &&
          options["null-literal"] === "nil"
        ) {
          text = "nil";
        }

        edits.push({
          newText: text,
          range: {
            start: document.positionAt(node.literal.start),
            end: document.positionAt(node.literal.start + node.literal.length),
          },
        });
        return;
      }

      if (element.kind === "TableLiteralNode") {
        const node = element as TableLiteralNode;

        if (node.leftDelimiter.kind === "LeftBracketDelimiter") {
          edits.push({
            newText: "{",
            range: {
              start: document.positionAt(node.leftDelimiter.start),
              end: document.positionAt(
                node.leftDelimiter.start + node.leftDelimiter.length,
              ),
            },
          });
        }

        if (node.rightDelimiter.kind === "RightBracketDelimiter") {
          edits.push({
            newText: "}",
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
