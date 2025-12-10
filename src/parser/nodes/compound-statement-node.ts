import { Token } from "../token";
import { Node } from "./node";

export class CompoundStatementNode extends Node {
  public leftBrace!: Token;
  public statements: (Node | Token)[] = [];
  public rightBrace!: Token;

  constructor() {
    super();

    this.kind = "CompoundStatementNode";
  }

  public override toJSON() {
    return {
      kind: this.kind,
      error: this.error,
      leftBrace: this.leftBrace,
      statements: this.statements,
      rightBrace: this.rightBrace,
    };
  }
}
