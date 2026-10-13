import { Scope } from "./scope";
import { SymbolType } from "./symbol-type";
import { Token } from "./token";

export class Symbol {
  public name: Token | string;
  public type: SymbolType = "unknown";
  // FIXME: We probably have to create a "TableSymbol" for this?
  public members: Scope | null = null;

  public constructor(name: Token | string, type: SymbolType = "unknown") {
    this.name = name;
    this.type = type;
  }
}
