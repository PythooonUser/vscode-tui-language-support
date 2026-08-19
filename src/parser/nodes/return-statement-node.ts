import { Token } from "../token";
import { Node } from "./node";

export class ReturnStatementNode extends Node {
  public returnKeyword!: Token;
  public expression: Node | Token | null = null;
  public delimiter: Token | null = null;

  constructor() {
    super();

    this.kind = "ReturnStatementNode";
  }

  override get start() {
    return this.returnKeyword.start;
  }

  override get length() {
    if (this.delimiter) {
      const start = this.delimiter.start - this.returnKeyword.start;
      return start + this.delimiter.length;
    }

    if (this.expression) {
      const start = this.expression.start - this.returnKeyword.start;
      return start + this.expression.length;
    }

    return this.returnKeyword.length;
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
