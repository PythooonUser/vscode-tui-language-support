import { Token } from "../token";
import { Node } from "./node";

export class BoolLiteralNode extends Node {
  public literal!: Token;

  constructor() {
    super();

    this.kind = "BoolLiteralNode";
  }

  override get start() {
    return this.literal.start;
  }

  override get length() {
    return this.literal.length;
  }

  public override toJSON() {
    return { kind: this.kind, error: this.error, literal: this.literal };
  }
}
