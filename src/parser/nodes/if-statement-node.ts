import { Token } from "../token";
import { CompoundStatementNode } from "./compound-statement-node";
import { Node } from "./node";

export class IfStatementNode extends Node {
  public ifKeyword!: Token;
  public condition!: Node;
  public statements!: CompoundStatementNode;

  constructor() {
    super();

    this.kind = "IfStatementNode";
  }

  override toJSON() {
    return {
      kind: this.kind,
      error: this.error,
      ifKeyword: this.ifKeyword,
      condition: this.condition,
      statements: this.statements,
    };
  }
}
