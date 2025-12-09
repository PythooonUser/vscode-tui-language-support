import { Token } from "../token";
import { Node } from "./node";

export class ForStatementNode extends Node {
  public forKeyword!: Token;
  public leftParen!: Token;
  public index: Node | null = null;
  public comma: Token | null = null;
  public value!: Node;
  public inKeyword!: Token;
  public object!: Node;
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
      index: this.index,
      comma: this.comma,
      value: this.value,
      inKeyword: this.inKeyword,
      object: this.object,
      rightParen: this.rightParen,
      statements: this.statements,
    };
  }
}
