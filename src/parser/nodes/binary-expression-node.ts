import { Token } from "../token";
import { Node } from "./node";

export class BinaryExpressionNode extends Node {
  public leftOperand!: Node;
  public operator!: Token;
  public rightOperand!: Node;

  constructor() {
    super();

    this.kind = "BinaryExpressionNode";
  }

  override get start() {
    return this.leftOperand.start;
  }

  override get length() {
    const start = this.rightOperand.start - this.leftOperand.start;
    return start + this.rightOperand.length;
  }

  public override toJSON() {
    return {
      kind: this.kind,
      error: this.error,
      leftOperand: this.leftOperand,
      operator: this.operator,
      rightOperand: this.rightOperand,
    };
  }
}
