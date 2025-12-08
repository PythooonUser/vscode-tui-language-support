import { Token } from "../token";
import { ListNode } from "./list-node";

export class ParameterDeclarationListNode extends ListNode {
  public leftParen!: Token;
  public rightParen!: Token;

  constructor() {
    super();

    this.kind = "ParameterDeclarationListNode";
  }

  public override toJSON() {
    return {
      kind: this.kind,
      error: this.error,
      leftParen: this.leftParen,
      elements: this.elements,
      rightParen: this.rightParen,
    };
  }
}
