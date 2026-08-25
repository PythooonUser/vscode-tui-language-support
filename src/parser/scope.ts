import { Symbol } from "./symbol";
import { Token } from "./token";

export type ScopeWalker = (scope: Scope) => void;

export class Scope {
  public parent: Scope | null;

  public readonly symbols: Symbol[] = [];

  public constructor(parent: Scope | null = null) {
    this.parent = parent;
  }

  public define(symbol: Symbol) {
    this.symbols.push(symbol);
  }

  public push() {
    const scope = new Scope(this);
    return scope;
  }

  public pop() {
    return this.parent;
  }

  public lookup(name: string) {
    let scope: Scope | null = this;

    while (scope) {
      const hit = scope.symbols.find(
        (symbol) =>
          (symbol.name instanceof Token && symbol.name.content === name) ||
          (symbol.name as string) === name,
      );
      if (hit) return hit;
      scope = scope.parent;
    }

    return null;
  }
}
