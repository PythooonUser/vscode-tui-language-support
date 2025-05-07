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

  override toJSON() {
    return {
      kind: this.kind,
      error: this.error,
      elseKeyword: this.elseKeyword,
      statements: this.statements,
    };
  }
}
