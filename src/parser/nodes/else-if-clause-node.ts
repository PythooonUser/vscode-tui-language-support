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

  override get start() {
    return (this.elseKeyword?.start || this.elseIfKeyword?.start) as number;
  }

  override get length() {
    const start =
      this.statements.start -
      ((this.elseKeyword?.start || this.elseIfKeyword?.start) as number);
    return start + this.statements.length;
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
