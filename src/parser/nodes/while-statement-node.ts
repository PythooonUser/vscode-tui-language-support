import { Token } from "../token";
import { Node } from "./node";

export class WhileStatementNode extends Node {
  public whileKeyword!: Token;
  public condition!: Node;
  public statements!: Node;

  constructor() {
    super();

    this.kind = "WhileStatementNode";
  }

  public override toJSON() {
    return {
      kind: this.kind,
      error: this.error,
      whileKeyword: this.whileKeyword,
      condition: this.condition,
      statements: this.statements,
    };
  }
}
