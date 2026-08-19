import { Token } from "../token";
import { Node } from "./node";

export class NumberLiteralNode extends Node {
  public literal!: Token;

  constructor() {
    super();

    this.kind = "NumberLiteralNode";
  }

  override get start() {
    return this.literal.start;
  }

  override get length() {
    return this.literal.length;
  }

  override toJSON() {
    return { kind: this.kind, error: this.error, literal: this.literal };
  }
}
