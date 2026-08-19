import { Token } from "../token";
import { Node } from "./node";

export class MemberAccessExpressionNode extends Node {
  public expression!: Node;
  public dot!: Token;
  public member!: Token;

  constructor() {
    super();

    this.kind = "MemberAccessExpressionNode";
  }

  override get start() {
    return this.expression.start;
  }

  override get length() {
    const start = this.member.start - this.expression.start;
    return start + this.member.length;
  }

  override toJSON() {
    return {
      kind: this.kind,
      error: this.error,
      expression: this.expression,
      dot: this.dot,
      member: this.member,
    };
  }
}
