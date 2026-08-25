import { Token } from "../token";
import { Node } from "./node";

export class BreakStatementNode extends Node {
  public breakKeyword!: Token;

  constructor() {
    super();

    this.kind = "BreakStatementNode";
  }

  override get start() {
    return this.breakKeyword.start;
  }

  override get length() {
    return this.breakKeyword.length;
  }

  public override toJSON() {
    return {
      kind: this.kind,
      error: this.error,
      breakKeyword: this.breakKeyword,
    };
  }
}
