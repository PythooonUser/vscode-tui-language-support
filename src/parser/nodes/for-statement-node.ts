import { Token } from "../token";
import { NodeOrTokenArray } from "../types";
import { Node } from "./node";

export class ForStatementNode extends Node {
  public forKeyword!: Token;
  public leftParen!: Token;
  public conditions: NodeOrTokenArray = [];
  public rightParen!: Token;
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
      leftParen: this.leftParen,
      conditions: this.conditions,
      rightParen: this.rightParen,
      statements: this.statements,
    };
  }
}
