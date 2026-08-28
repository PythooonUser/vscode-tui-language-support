import { Symbol } from "./symbol";
import { Token } from "./token";

export type ScopeWalker = (scope: Scope) => void;

export class Scope {
  private _parent: Scope | null = null;
  public children: Scope[] = [];

  public readonly symbols: Symbol[] = [];

  public get parent(): Scope | null {
    return this._parent;
  }

  public set parent(value: Scope | null) {
    if (this._parent === value) return;

    this._parent = value;
    if (value) {
      value.children.push(this);
    }
  }

  public constructor(parent: Scope | null = null) {
    this.parent = parent;
  }

  public define(symbol: Symbol) {
    this.symbols.push(symbol);
  }

  public removeChild(scope: Scope) {
    const index = this.children.indexOf(scope);
    if (index !== -1) {
      this.children.splice(index, 1);
    }
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
