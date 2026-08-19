import { Token } from "../token";
import { Node } from "./node";

export class ExpressionStatementNode extends Node {
  public expression!: Node | Token;
  public delimiter: Token | null = null;

  constructor() {
    super();

    this.kind = "ExpressionStatementNode";
  }

  override get start() {
    return this.expression.start;
  }

  override get length() {
    if (!this.delimiter) {
      return this.expression.length;
    }

    const start = this.delimiter.start - this.expression.start;
    return start + this.expression.length;
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
