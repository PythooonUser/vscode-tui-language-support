import { Token } from "../token";
import { Node } from "./node";

export class UnaryExpressionNode extends Node {
  public operator!: Token;
  public operand!: Node;

  constructor() {
    super();

    this.kind = "UnaryExpressionNode";
  }

  override toJSON() {
    return {
      kind: this.kind,
      error: this.error,
      operator: this.operator,
      operand: this.operand,
    };
  }
}
