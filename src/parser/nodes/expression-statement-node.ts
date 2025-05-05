import { Token } from "../token";
import { Node } from "./node";

export class ExpressionStatementNode extends Node {
  public expression!: Node | Token;
  public delimiter!: Token;

  constructor() {
    super();

    this.kind = "ExpressionStatementNode";
  }

  override toJSON() {
    return {
      kind: this.kind,
      error: this.error,
      expression: this.expression,
      delimiter: this.delimiter,
    };
  }
}
