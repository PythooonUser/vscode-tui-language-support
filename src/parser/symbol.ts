import { Node } from "./nodes";
import { Scope } from "./scope";
import { SymbolKind } from "./symbol-kind";
import { SymbolType } from "./symbol-type";
import { Token } from "./token";

export class Symbol {
  public name: Token | string;
  public kind: SymbolKind = "variable";
  public type: SymbolType = "unknown";
  public initializer: Node | null = null;
  // FIXME: We probably have to create a "TableSymbol" for this?
  public members: Scope | null = null;
  // The symbols of the array part of a table, i.e. its bare elements.
  public arrayElements!: Symbol[] | null;

  public constructor(name: Token | string) {
    this.name = name;
  }
}
