import { ArgumentExpressionListNode } from "./argument-expression-list-node";
import { Node } from "./node";

export class CallExpressionNode extends Node {
  public expression!: Node;
  public arguments!: ArgumentExpressionListNode;

  constructor() {
    super();

    this.kind = "CallExpressionNode";
  }

  override get start() {
    return this.expression.start;
  }

  override get length() {
    const start = this.arguments.start - this.expression.start;
    return start + this.arguments.length;
  }

  override toJSON() {
    return {
      kind: this.kind,
      error: this.error,
      expression: this.expression,
      arguments: this.arguments,
    };
  }
}
