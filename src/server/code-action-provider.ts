import { TextDocument } from "vscode-languageserver-textdocument";
import {
  CodeAction,
  CodeActionKind,
  Diagnostic,
  Range,
  TextEdit,
} from "vscode-languageserver/node";
import { SourceDocumentNode, Token } from "../parser";

const globalPattern = /^(?:#|\/\/)\s*global\s+(.+)\s*$/;

export class CodeActionProvider {
  public provide(
    diagnostics: Diagnostic[],
    document: TextDocument,
    ast: SourceDocumentNode,
  ): CodeAction[] {
    const actions: CodeAction[] = [];

    for (const diagnostic of diagnostics) {
      if (diagnostic.code !== "undefined-symbol") continue;

      const name = this.extractName(diagnostic.message);
      if (!name) continue;

      const existing = this.findGlobalLine(ast);
      const edits: TextEdit[] = [];

      if (existing) {
        const existingNames = globalPattern
          .exec(existing.content)?.[1]
          .split(/\s+/);
        if (existingNames?.includes(name)) {
          continue;
        }

        edits.push({
          range: this.lineRange(document, existing.start, existing.length),
          newText: `${existing.content} ${name}`,
        });
      } else {
        edits.push({
          range: {
            start: { line: 0, character: 0 },
            end: { line: 0, character: 0 },
          },
          newText: `# global ${name}\n`,
        });
      }

      actions.push({
        title: `Add '${name}' to global declarations`,
        kind: CodeActionKind.QuickFix,
        diagnostics: [diagnostic],
        edit: {
          changes: {
            [document.uri]: edits,
          },
        },
      });
    }

    return actions;
  }

  private findGlobalLine(ast: SourceDocumentNode): Token | null {
    let global: Token | null = null;

    ast.walk((element) => {
      if (global) return true;
      if (!(element instanceof Token)) return;
      if (element.kind !== "Comment") return;

      if (globalPattern.test(element.content)) {
        global = element;
        return true;
      }
    });

    return global;
  }

  private extractName(message: string): string | null {
    const match = /Undefined symbol '(.+)'\./.exec(message);
    return match ? match[1] : null;
  }

  private lineRange(
    document: TextDocument,
    start: number,
    length: number,
  ): Range {
    const text = document.getText();
    const newLineIndex = text.indexOf("\n", start);

    const endOffset = newLineIndex !== -1 ? newLineIndex : start + length;

    return {
      start: document.positionAt(start),
      end: document.positionAt(endOffset),
    };
  }
}
