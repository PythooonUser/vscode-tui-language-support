import { Token } from "../token";
import { CompoundStatementNode } from "./compound-statement-node";
import { ElseClauseNode } from "./else-clause-node";
import { Node } from "./node";

export class MemberAccessExpressionNode extends Node {
  public expression!: Node;
  public dot!: Token;
  public member!: Token;

  constructor() {
    super();

    this.kind = "MemberAccessExpressionNode";
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
