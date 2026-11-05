import { Scope } from "../parser/scope";
import { Symbol } from "../parser/symbol";
import { Token } from "../parser/token";

/**
 * Renders the type of a symbol as a type expression: tables with known
 * members (i.e. from their initial literal definition) are rendered
 * structurally as `{ key: type; ... }` and tables with known array elements
 * as `{ type; ... }` expressions formatted over multiple lines.
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
    if (!symbol.members && !symbol.arrayElements) {
      return symbol.type;
    }

    const entries = [
      ...this.renderMemberEntries(symbol.members!, level),
      ...this.renderArrayElementEntries(symbol.arrayElements!, level),
    ];

    if (entries.length === 0) {
      return "{}";
    }

    return `{\n${entries.join(";\n")}\n${this.indent(level)}}`;
  }

  private indent(level: number): string {
    return "  ".repeat(level);
  }

  private renderKey(symbol: Symbol): string {
    const name =
      symbol.name instanceof Token ? symbol.name.content : symbol.name;

    return /^[A-Za-z_][A-Za-z0-9_]*$/.test(name) ? name : `"${name}"`;
  }

  private renderMemberEntries(members: Scope, level: number): string[] {
    return members.symbols.map(
      (member) =>
        `${this.indent(level + 1)}${this.renderKey(member)}: ${this.render(member, level + 1)}`,
    );
  }

  private renderArrayElementEntries(
    arrayElements: Symbol[],
    level: number,
  ): string[] {
    const entries = arrayElements.map(
      (arrayElement) =>
        `${this.indent(level + 1)}${this.render(arrayElement, level + 1)}`,
    );

    if (entries.length <= 1) {
      return entries;
    }

    const [firstEntry] = entries;
    return entries.every((entry) => entry === firstEntry)
      ? [firstEntry]
      : entries;
  }
}
