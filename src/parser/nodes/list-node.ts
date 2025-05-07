import { Token } from "../token";
import { Node } from "./node";

export abstract class ListNode extends Node {
  public elements: (Node | Token)[] = [];

  public addElement(element: Node | Token): void {
    this.elements.push(element);
  }

  public override toJSON() {
    return { kind: this.kind, error: this.error, elements: this.elements };
  }
}
