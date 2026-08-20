import { TextDocument, TextEdit } from "vscode-languageserver-textdocument";
import {
  NullLiteralNode,
  SourceDocumentNode,
  TableLiteralNode,
} from "../parser";

export class Formatter {
  public format(document: TextDocument, ast: SourceDocumentNode): TextEdit[] {
    const edits: TextEdit[] = [];

    ast.walk((element) => {
      if (element.kind === "NullLiteralNode") {
        const node = element as NullLiteralNode;

        if (node.literal.kind === "NilKeyword") {
          edits.push({
            newText: "null",
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
