import { Scope } from "./scope";
import { Token } from "./token";

export class Symbol {
  public name: Token | string;
  // FIXME: We probably have to create a "TableSymbol" for this?
  public members: Scope | null = null;

  public constructor(name: Token | string) {
    this.name = name;
  }
}
