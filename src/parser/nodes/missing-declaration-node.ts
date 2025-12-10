import { Token } from "../token";
import { Node } from "./node";

export class MissingDeclarationNode extends Node {
  public declaration!: Token;

  constructor() {
    super();

    this.kind = "MissingDeclarationNode";
  }

  public override toJSON() {
    return {
      kind: this.kind,
      error: this.error,
      declaration: this.declaration,
    };
  }
}
