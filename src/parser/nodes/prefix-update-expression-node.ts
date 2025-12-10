import { Token } from "../token";
import { Node } from "./node";

export class PrefixUpdateExpressionNode extends Node {
  public operator!: Token;
  public operand!: Node | Token;

  constructor() {
    super();

    this.kind = "PrefixUpdateExpressionNode";
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
