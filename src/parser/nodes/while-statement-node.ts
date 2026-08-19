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

  override get start() {
    return this.whileKeyword.start;
  }

  override get length() {
    const start = this.statements.start - this.whileKeyword.start;
    return start + this.statements.length;
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
