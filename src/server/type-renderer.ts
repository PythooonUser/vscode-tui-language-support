import { Symbol } from "../parser/symbol";
import { Token } from "../parser/token";

/**
 * Renders the type of a symbol as a type expression: tables with known
 * members (i.e. from their initial literal definition) are rendered
 * structurally as `{ key: type; ... }` expressions formatted over multiple
 * lines.
 */
export class TypeRenderer {
  /**
   * Renders the type expression of a symbol.
   *
   * @param symbol The symbol to render the type expression of.
   * @param level The number of nested table levels the expression is
   *   rendered at, used to indent nested tables.
   */
  public render(symbol: Symbol, level: number = 0): string {
    if (!symbol.members) {
      return symbol.type;
    }

    if (symbol.members.symbols.length === 0) {
      return "{}";
    }

    const members = symbol.members.symbols.map(
      (member) =>
        `${this.indent(level + 1)}${this.renderKey(member)}: ${this.render(member, level + 1)}`,
    );

    return `{\n${members.join(";\n")}\n${this.indent(level)}}`;
  }

  private indent(level: number): string {
    return "  ".repeat(level);
  }

  private renderKey(symbol: Symbol): string {
    const name =
      symbol.name instanceof Token ? symbol.name.content : symbol.name;

    return /^[A-Za-z_][A-Za-z0-9_]*$/.test(name) ? name : `"${name}"`;
  }
}
