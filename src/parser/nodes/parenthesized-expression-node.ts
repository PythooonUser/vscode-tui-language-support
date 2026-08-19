import { Token } from "../token";
import { Node } from "./node";

export class ParenthesizedExpressionNode extends Node {
  public leftParen!: Token;
  public expression!: Node | Token;
  public rightParen!: Token;

  constructor() {
    super();

    this.kind = "ParenthesizedExpressionNode";
  }

  override get start() {
    return this.leftParen.start;
  }

  override get length() {
    const start = this.rightParen.start - this.leftParen.start;
    return start + this.rightParen.length;
  }

  override toJSON() {
    return {
      kind: this.kind,
      error: this.error,
      leftParen: this.leftParen,
      expression: this.expression,
      rightParen: this.rightParen,
    };
  }
}
