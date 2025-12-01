import { Hover } from "vscode-languageserver/node";
import { SourceDocumentNode, Token } from "../parser";

export class HoverResolver {
  public resolve(offset: number, ast: SourceDocumentNode): Hover | null {
    let symbol: Token | undefined = undefined;

    ast.walk((nodeOrToken) => {
      if (
        nodeOrToken instanceof Token &&
        offset >= nodeOrToken.start &&
        offset <= nodeOrToken.start + nodeOrToken.length
      ) {
        symbol = nodeOrToken;
        return true;
      }
    });

    // @ts-expect-error `symbol` can be `Token` when found in the AST-search above
    if (symbol && symbol.kind === "Name") {
      return {
        contents: {
          kind: "plaintext",
          language: "tui",
          // @ts-expect-error `symbol` can be `Token` when found in the AST-search above
          value: `(name) ${symbol.content}`,
        },
      };
    }

    return null;
  }
}
