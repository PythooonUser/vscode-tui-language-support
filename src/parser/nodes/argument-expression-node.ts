import { Node } from "./node";

export class ArgumentExpressionNode extends Node {
  public argument!: Node;

  constructor() {
    super();

    this.kind = "ArgumentExpressionNode";
  }

  public override toJSON() {
    return { kind: this.kind, error: this.error, argument: this.argument };
  }
}
