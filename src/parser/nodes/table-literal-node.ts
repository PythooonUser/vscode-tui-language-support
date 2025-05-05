import { Token } from "../token";
import { Node } from "./node";

export class TableLiteralNode extends Node {
  public leftDelimiter!: Token;
  public elements: (Node | Token)[] = [];
  public rightDelimiter!: Token;

  constructor() {
    super();

    this.kind = "TableLiteralNode";
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
