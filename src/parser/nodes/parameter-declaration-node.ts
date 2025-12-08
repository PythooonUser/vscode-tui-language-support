import { Token } from "../token";
import { Node } from "./node";

export class ParameterDeclarationNode extends Node {
  public name!: Token;

  constructor() {
    super();

    this.kind = "ParameterDeclarationNode";
  }

  public override toJSON() {
    return {
      kind: this.kind,
      error: this.error,
      name: this.name,
    };
  }
}
