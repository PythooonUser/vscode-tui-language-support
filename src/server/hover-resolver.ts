import { Hover, MarkupContent } from "vscode-languageserver/node";
import {
  ParameterDeclarationNode,
  SourceDocumentNode,
  Token,
  VariableNode,
} from "../parser";
import { Symbol } from "../parser/symbol";
import { SymbolKind } from "../parser/symbol-kind";
import { TypeRenderer } from "./type-renderer";

export class HoverResolver {
  public resolve(offset: number, ast: SourceDocumentNode): Hover | null {
    let definition: VariableNode | ParameterDeclarationNode | undefined =
      undefined;
    let name: Token | undefined = undefined;

    ast.walk((nodeOrToken) => {
      if (nodeOrToken instanceof VariableNode) {
        if (
          offset >= nodeOrToken.name.start &&
          offset <= nodeOrToken.name.start + nodeOrToken.name.length
        ) {
          definition = nodeOrToken;
          return true;
        }

        return;
      }

      if (nodeOrToken instanceof ParameterDeclarationNode) {
        if (
          offset >= nodeOrToken.name.start &&
          offset <= nodeOrToken.name.start + nodeOrToken.name.length
        ) {
          definition = nodeOrToken;
          return true;
        }

        return;
      }

      if (
        nodeOrToken instanceof Token &&
        nodeOrToken.kind === "Name" &&
        offset >= nodeOrToken.start &&
        offset <= nodeOrToken.start + nodeOrToken.length
      ) {
        name = nodeOrToken;
        return true;
      }
    });

    if (definition) {
      return { contents: this.definitionHover(definition) };
    }

    if (name) {
      return { contents: this.nameHover(name) };
    }

    return null;
  }

  /**
   * Builds the hover contents for a variable or parameter definition,
   * rendering its kind and type expression as a `tui-type` code block
   * for syntax highlighting.
   *
   * @param definition The resolved variable or parameter definition.
   */
  private definitionHover(
    definition: VariableNode | ParameterDeclarationNode,
  ): MarkupContent {
    const fallbackKind =
      definition instanceof ParameterDeclarationNode ? "parameter" : "variable";

    return this.symbolHover(
      definition.scope.lookup(definition.name.content),
      definition.name.content,
      fallbackKind,
    );
  }

  /**
   * Builds the hover contents for a plain name.
   *
   * @param name The name token to display.
   */
  private nameHover(name: Token): MarkupContent {
    return this.symbolHover(null, name.content, "name");
  }

  /**
   * Builds the hover contents for a symbol, rendering its kind and type
   * expression as a `tui-type` code block for syntax highlighting.
   *
   * @param symbol The resolved symbol or `null` if none was found.
   * @param name The name to display.
   * @param fallbackKind The kind to use when no symbol was resolved.
   */
  private symbolHover(
    symbol: Symbol | null,
    name: string,
    fallbackKind: SymbolKind | "name",
  ): MarkupContent {
    const kind = symbol?.kind ?? fallbackKind;
    const type = symbol ? new TypeRenderer().render(symbol) : "unknown";

    return {
      kind: "markdown",
      value: `\`\`\`tui-type\n(${kind}) ${name}: ${type}\n\`\`\``,
    };
  }
}
