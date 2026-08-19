import { Token } from "../token";
import { Node } from "./node";

export class IndexedAccessExpressionNode extends Node {
  public expression!: Node;
  public leftBracket!: Token;
  public index!: Node;
  public rightBracket!: Token;

  constructor() {
    super();

    this.kind = "IndexedAccessExpressionNode";
  }

  override get start() {
    return this.expression.start;
  }

  override get length() {
    const start = this.rightBracket.start - this.expression.start;
    return start + this.rightBracket.length;
  }

  override toJSON() {
    return {
      kind: this.kind,
      error: this.error,
      expression: this.expression,
      leftBracket: this.leftBracket,
      index: this.index,
      rightBracket: this.rightBracket,
    };
  }
}
