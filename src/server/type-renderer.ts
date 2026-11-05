import { Symbol } from "../parser/symbol";
import { Token } from "../parser/token";

/**
 * Renders the type of a symbol as a type expression: tables with known
 * members (i.e. from their initial literal definition) are rendered
 * structurally as `{ key: type }` expressions.
 */
export class TypeRenderer {
  /**
   * Renders the type expression of a symbol.
   *
   * @param symbol The symbol to render the type expression of.
   */
  public render(symbol: Symbol): string {
    if (!symbol.members) {
      return symbol.type;
    }

    if (symbol.members.symbols.length === 0) {
      return "{}";
    }

    const members = symbol.members.symbols.map(
      (member) => `${this.renderKey(member)}: ${this.render(member)}`,
    );

    return `{ ${members.join("; ")} }`;
  }

  private renderKey(symbol: Symbol): string {
    const name =
      symbol.name instanceof Token ? symbol.name.content : symbol.name;

    return /^[A-Za-z_][A-Za-z0-9_]*$/.test(name) ? name : `"${name}"`;
  }
}
