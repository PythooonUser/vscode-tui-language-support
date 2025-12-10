import { Token } from "../token";
import { Node } from "./node";

export class BoolLiteralNode extends Node {
  public literal!: Token;

  constructor() {
    super();

    this.kind = "BoolLiteralNode";
  }

  public override toJSON() {
    return { kind: this.kind, error: this.error, literal: this.literal };
  }
}
