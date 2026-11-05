import { Scope } from "../scope";
import { Symbol } from "../symbol";
import { Token } from "../token";
import { Node } from "./node";

export class TableLiteralNode extends Node {
  public leftDelimiter!: Token;
  public elements: (Node | Token)[] = [];
  public rightDelimiter!: Token;
  public members: Scope | null = null;
  /**
   * The symbols of the literal's elements that are not member definitions,
   * i.e. the values of the array part of the table, named by their index.
   */
  public arrayElements!: Symbol[] | null;

  constructor() {
    super();

    this.kind = "TableLiteralNode";
  }

  override get start() {
    return this.leftDelimiter.start;
  }

  override get length() {
    const start = this.rightDelimiter.start - this.leftDelimiter.start;
    return start + this.rightDelimiter.length;
  }

  public override toJSON() {
    return {
      kind: this.kind,
      error: this.error,
      leftDelimiter: this.leftDelimiter,
      elements: this.elements,
      rightDelimiter: this.rightDelimiter,
    };
  }
}
