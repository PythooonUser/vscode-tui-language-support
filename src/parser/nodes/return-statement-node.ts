import { Token } from "../token";
import { Node } from "./node";

export class ReturnStatementNode extends Node {
  public returnKeyword!: Token;
  public expression: Node | Token | null = null;
  public delimiter!: Token;

  constructor() {
    super();

    this.kind = "ReturnStatementNode";
  }

  override toJSON() {
    return {
      kind: this.kind,
      error: this.error,
      returnKeyword: this.returnKeyword,
      expression: this.expression,
      delimiter: this.delimiter,
    };
  }
}
