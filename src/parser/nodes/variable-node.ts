import { Token } from "../token";
import { Node } from "./node";

export class VariableNode extends Node {
  public name!: Token;

  constructor() {
    super();

    this.kind = "VariableNode";
  }

  public override toJSON() {
    return { kind: this.kind, error: this.error, name: this.name };
  }
}
