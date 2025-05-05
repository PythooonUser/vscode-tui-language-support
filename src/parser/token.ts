import { Node } from "./nodes";
import { TokenError } from "./token-error";
import { TokenKind } from "./token-kind";

export class Token {
  private _parent!: Node;

  set parent(value: Node) {
    this._parent = value;

    // Update the trivia's parent as well, so that we can grab the `content`.
    this.trivia.forEach((token) => (token.parent = value));
  }

  get parent() {
    return this._parent;
  }

  get content() {
    return this.parent.root.document.slice(
      this.start,
      this.start + this.length
    );
  }

  constructor(
    public start: number,
    public length: number,
    public kind: TokenKind,
    public trivia: Token[],
    public error: TokenError | null
  ) {}

  toJSON() {
    return {
      start: this.start,
      length: this.length,
      kind: this.kind,
      trivia: this.trivia,
      error: this.error,
    };
  }
}
