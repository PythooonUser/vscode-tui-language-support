import { Token } from "../token";
import { Node } from "./node";

export class NullLiteralNode extends Node {
  public literal!: Token;

  constructor() {
    super();

    this.kind = "NullLiteralNode";
  }

  public override toJSON() {
    return { kind: this.kind, error: this.error, literal: this.literal };
  }
}
