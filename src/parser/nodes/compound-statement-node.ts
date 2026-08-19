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

  override get start() {
    return this.leftBrace.start;
  }

  override get length() {
    const start = this.rightBrace.start - this.leftBrace.start;
    return start + this.rightBrace.length;
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
