import { Token } from "../token";
import { Node } from "./node";

export class UnaryExpressionNode extends Node {
  public operator!: Token;
  public operand!: Node;

  constructor() {
    super();

    this.kind = "UnaryExpressionNode";
  }

  override get start() {
    return this.operator.start;
  }

  override get length() {
    const start = this.operand.start - this.operator.start;
    return start + this.operand.length;
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
