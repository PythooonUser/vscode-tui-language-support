import { Token } from "../token";
import { Node } from "./node";

export class PostfixUpdateExpressionNode extends Node {
  public operand!: Node;
  public operator!: Token;

  constructor() {
    super();

    this.kind = "PostfixUpdateExpressionNode";
  }

  override get start() {
    return this.operand.start;
  }

  override get length() {
    const start = this.operator.start - this.operand.start;
    return start + this.operator.length;
  }

  public override toJSON() {
    return {
      kind: this.kind,
      error: this.error,
      operand: this.operand,
      operator: this.operator,
    };
  }
}
