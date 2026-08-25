import { Token } from ".";

export type ScopeWalker = (scope: Scope) => void;

export class Scope {
  public readonly parent: Scope | null;
  public readonly children: Scope[] = [];

  public readonly symbols: Token[] = [];

  public constructor(parent: Scope | null = null) {
    this.parent = parent;
  }

  public define(symbol: Token) {
    this.symbols.push(symbol);
  }

  public push() {
    const scope = new Scope(this);
    this.children.push(scope);
    return scope;
  }

  public pop() {
    return this.parent;
  }

  public walk(walker: ScopeWalker) {
    walker(this);

    for (const child of this.children) {
      child.walk(walker);
    }
  }

  public lookup(name: string) {
    let scope: Scope | null = this;

    while (scope) {
      const hit = scope.symbols.find((symbol) => symbol.content === name);
      if (hit) return hit;
      scope = scope.parent;
    }

    return null;
  }
}
