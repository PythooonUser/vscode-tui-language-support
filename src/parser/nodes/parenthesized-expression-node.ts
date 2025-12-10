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
