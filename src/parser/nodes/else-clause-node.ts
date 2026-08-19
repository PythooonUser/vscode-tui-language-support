import { Token } from "../token";
import { CompoundStatementNode } from "./compound-statement-node";
import { Node } from "./node";

export class ElseClauseNode extends Node {
  public elseKeyword!: Token;
  public statements!: CompoundStatementNode;

  constructor() {
    super();

    this.kind = "ElseClauseNode";
  }

  override get start() {
    return this.elseKeyword.start;
  }

  override get length() {
    const start = this.statements.start - this.elseKeyword.start;
    return start + this.statements.length;
  }

  override toJSON() {
    return {
      kind: this.kind,
      error: this.error,
      elseKeyword: this.elseKeyword,
      statements: this.statements,
    };
  }
}
