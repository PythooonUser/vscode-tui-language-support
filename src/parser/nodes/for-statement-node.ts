import { Token } from "../token";
import { Node } from "./node";

export class ForStatementNode extends Node {
  public forKeyword!: Token;
  public statements!: Node;

  constructor() {
    super();

    this.kind = "ForStatementNode";
  }

  public override toJSON() {
    return {
      kind: this.kind,
      error: this.error,
      forKeyword: this.forKeyword,
      statements: this.statements,
    };
  }
}
