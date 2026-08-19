import { NodeError } from "../node-error";
import { NodeKind } from "../node-kind";
import { Token } from "../token";
import { SourceDocumentNode } from ".";

export type NodeWalker = (element: Node | Token) => void | true;

/** Represents a single `Node` in the abstract syntax tree. */
export abstract class Node {
  /** The kind of the node. */
  public kind!: NodeKind;

  /** The parent node of the node. */
  public parent: Node | null = null;

  /** The error of the node in case of parse issues. */
  public error: NodeError | null = null;

  public get root() {
    let node: Node = this;

    while (node.parent !== null) {
      node = node.parent;
    }

    if (!(node instanceof SourceDocumentNode)) {
      throw new Error("Expected root node to be of type 'SourceDocumentNode'.");
    }

    return node;
  }

  public get start(): number {
    throw new Error(`'start' not implemented on ${this.kind}.`);
  }

  public get length(): number {
    throw new Error(`'length' not implemented on ${this.kind}.`);
  }

  walk(callback: NodeWalker): void {
    for (const key in this) {
      if (["parent", "kind", "error"].includes(key)) {
        continue;
      }

      const child = this[key];

      if (child instanceof Token) {
        for (const trivia of child.trivia) {
          if (callback(trivia)) return;
        }
        if (callback(child)) return;
      } else if (child instanceof Node) {
        if (callback(child)) return;
        child.walk(callback);
      } else if (Array.isArray(child)) {
        for (const element of child) {
          if (element instanceof Token) {
            for (const trivia of element.trivia) {
              if (callback(trivia)) return;
            }
            if (callback(element)) return;
          } else if (element instanceof Node) {
            if (callback(element)) return;
            element.walk(callback);
          }
        }
      }
    }
  }

  toJSON() {
    return { kind: this.kind, error: this.error };
  }
}
