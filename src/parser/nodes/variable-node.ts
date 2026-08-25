import { Scope } from "../scope";
import { Token } from "../token";
import { Node } from "./node";

export class VariableNode extends Node {
  public name!: Token;
  public scope!: Scope;

  constructor() {
    super();

    this.kind = "VariableNode";
  }

  override get start() {
    return this.name.start;
  }

  override get length() {
    return this.name.length;
  }

  public override toJSON() {
    return { kind: this.kind, error: this.error, name: this.name };
  }
}
