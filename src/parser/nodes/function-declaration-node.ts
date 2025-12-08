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
