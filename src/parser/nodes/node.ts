import { NodeError } from "../node-error";
import { NodeKind } from "../node-kind";
import { Token } from "../token";
import { SourceDocumentNode } from "./source-document-node";

export type NodeWalker = (element: Node | Token) => void;

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

  walk(callback: NodeWalker): void {
    for (const key in this) {
      if (["parent", "kind", "error"].includes(key)) {
        continue;
      }

      const child = this[key];

      if (child instanceof Token) {
        callback(child);
      } else if (child instanceof Node) {
        callback(child);
        child.walk(callback);
      } else if (Array.isArray(child)) {
        for (const element of child) {
          if (element instanceof Token) {
            callback(element);
          } else if (element instanceof Node) {
            callback(element);
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
