import { Node } from "./node";

export class ArgumentExpressionNode extends Node {
  public argument!: Node;

  constructor() {
    super();

    this.kind = "ArgumentExpressionNode";
  }

  override get start() {
    return this.argument.start;
  }

  override get length() {
    return this.argument.length;
  }

  public override toJSON() {
    return { kind: this.kind, error: this.error, argument: this.argument };
  }
}
