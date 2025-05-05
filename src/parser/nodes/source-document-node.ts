import { Token } from "../token";
import { NodeOrTokenArray } from "../types";
import { Node } from "./node";

export class SourceDocumentNode extends Node {
  public statements: NodeOrTokenArray = [];
  public endOfFile!: Token;
  public document = "";

  constructor() {
    super();

    this.kind = "SourceDocumentNode";
  }

  override toJSON() {
    return {
      kind: this.kind,
      error: this.error,
      statements: this.statements,
      endOfFile: this.endOfFile,
    };
  }
}
