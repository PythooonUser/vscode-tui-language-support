import { Token } from "../token";
import { Node } from "./node";

export class FunctionDeclarationNode extends Node {
  public functionKeyword!: Token;
  public leftParen!: Token;
  public arguments!: Node | Token;
  public rightParen!: Token;
  public statements!: Node | Token;
  public delimiter: Token | null = null;

  constructor() {
    super();

    this.kind = "FunctionDeclarationNode";
  }

  override get start() {
    return this.functionKeyword.start;
  }

  override get length() {
    if (this.delimiter) {
      const start = this.delimiter.start - this.functionKeyword.start;
      return start + this.delimiter.length;
    }

    const start = this.statements.start - this.functionKeyword.start;
    return start + this.statements.length;
  }

  override toJSON() {
    return {
      kind: this.kind,
      error: this.error,
      functionKeyword: this.functionKeyword,
      leftParen: this.leftParen,
      arguments: this.arguments,
      rightParen: this.rightParen,
      statements: this.statements,
      delimiter: this.delimiter,
    };
  }
}
