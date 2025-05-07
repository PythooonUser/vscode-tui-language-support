import { Token } from "../token";
import { Node } from "./node";

export class NumberLiteralNode extends Node {
  public literal!: Token;

  constructor() {
    super();

    this.kind = "NumberLiteralNode";
  }

  override toJSON() {
    return { kind: this.kind, error: this.error, literal: this.literal };
  }
}
