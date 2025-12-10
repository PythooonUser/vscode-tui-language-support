import { Token } from "../token";
import { CompoundStatementNode } from "./compound-statement-node";
import { Node } from "./node";

export class ElseIfClauseNode extends Node {
  public elseKeyword: Token | null = null;
  public ifKeyword: Token | null = null;
  public elseIfKeyword: Token | null = null;
  public condition!: Node;
  public statements!: CompoundStatementNode;

  constructor() {
    super();

    this.kind = "ElseIfClauseNode";
  }

  override toJSON() {
    return {
      kind: this.kind,
      error: this.error,
      elseKeyword: this.elseKeyword,
      ifKeyword: this.ifKeyword,
      elseIfKeyword: this.elseIfKeyword,
      condition: this.condition,
      statements: this.statements,
    };
  }
}
