import { Token } from "../token";
import { Node } from "./node";

export class PrefixUpdateExpressionNode extends Node {
  public operator!: Token;
  public operand!: Node | Token;

  constructor() {
    super();

    this.kind = "PrefixUpdateExpressionNode";
  }

  override get start() {
    return this.operator.start;
  }

  override get length() {
    const start = this.operand.start - this.operator.start;
    return start + this.operand.length;
  }

  public override toJSON() {
    return {
      kind: this.kind,
      error: this.error,
      operator: this.operator,
      operand: this.operand,
    };
  }
}
