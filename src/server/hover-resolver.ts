import { Hover } from "vscode-languageserver/node";
import { SourceDocumentNode, Token, VariableNode } from "../parser";
import { Symbol } from "../parser/symbol";

export class HoverResolver {
  public resolve(offset: number, ast: SourceDocumentNode): Hover | null {
    let variable: VariableNode | undefined = undefined;
    let name: Token | undefined = undefined;

    ast.walk((nodeOrToken) => {
      if (nodeOrToken instanceof VariableNode) {
        if (
          offset >= nodeOrToken.name.start &&
          offset <= nodeOrToken.name.start + nodeOrToken.name.length
        ) {
          variable = nodeOrToken;
          return true;
        }

        return;
      }

      if (
        nodeOrToken instanceof Token &&
        offset >= nodeOrToken.start &&
        offset <= nodeOrToken.start + nodeOrToken.length
      ) {
        name = nodeOrToken;
        return true;
      }
    });

    if (variable) {
      // @ts-expect-error `variable` is `VariableNode` when found in the AST-search above
      const symbol = variable.scope.lookup(variable.name.content);

      return {
        contents: {
          kind: "plaintext",
          language: "tui",
          // @ts-expect-error `variable` is `VariableNode` when found in the AST-search above
          value: `(${symbol?.type ?? "unknown"}) ${variable.name.content}`,
        },
      };
    }

    // @ts-expect-error `name` is `Token` when found in the AST-search above
    if (name && name.kind === "Name") {
      return {
        contents: {
          kind: "plaintext",
          language: "tui",
          // @ts-expect-error `name` is `Token` when found in the AST-search above
          value: `(name) ${name.content}`,
        },
      };
    }

    return null;
  }
}
