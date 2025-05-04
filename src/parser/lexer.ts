import { Token } from "./token";
import { TokenError } from "./token-error";
import { TokenKind } from "./token-kind";

export class Lexer {
  public document: string;
  public length: number;
  public index: number;
  public trivia: Token[];
  public tokens: Token[];

  constructor() {
    this.document = "";
    this.length = 0;
    this.index = -1;
    this.trivia = [];
    this.tokens = [];
  }

  public reset(document: string) {
    this.document = document;
    this.length = document.length;
    this.index = -1;
    this.trivia = [];
    this.tokens = [];
  }

  public advance() {
    if (this.tokens.length > 0) {
      const token = this.tokens[0];
      this.tokens = this.tokens.slice(1);
      return token;
    }

    return this.load();
  }

  private load() {
    const character = this.next();

    if (character === null) {
      return this.handleEndOfFile();
    }

    return this.makeToken(this.index, 1, "UnknownToken", "UnknownToken");
  }

  private next() {
    if (this.index === this.length - 1) {
      this.index++;
      return null;
    }

    if (this.index > this.length - 1) {
      this.index++;
      return null;
    }

    this.index++;
    return this.document[this.index];
  }

  private makeToken(
    start: number,
    length: number,
    kind: TokenKind,
    error: TokenError | null = null
  ) {
    const token = new Token(start, length, kind, this.trivia, error);
    this.trivia = [];
    return token;
  }

  private handleEndOfFile() {
    if (this.index === this.length) {
      return this.makeToken(this.index, 0, "EndOfFile");
    }

    return null;
  }
}
