import { Token } from "../token";
import { NodeOrTokenArray } from "../types";
import { Node } from ".";

export class SourceDocumentNode extends Node {
  public statements: NodeOrTokenArray = [];
  public endOfFile!: Token;
  public document = "";

  constructor() {
    super();

    this.kind = "SourceDocumentNode";
  }

  public override toJSON() {
    return {
      kind: this.kind,
      error: this.error,
      statements: this.statements,
      endOfFile: this.endOfFile,
    };
  }
}
