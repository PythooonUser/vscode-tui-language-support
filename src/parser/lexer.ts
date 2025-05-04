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

  /**
   * Returns the next character in the source document without advancing the internal state.
   */
  private peek(step = 1) {
    const index = this.index + step;

    if (index >= this.length) {
      return null;
    }

    return this.document[index];
  }

  private load(): Token | null {
    const character = this.next();

    if (character === null) {
      return this.handleEndOfFile();
    }

    if (" \t\r\n".includes(character)) {
      this.parseWhitespaceTrivia();
      return this.load();
    }

    if (character === "#") {
      this.parseCommentTrivia();
      return this.load();
    }

    if ("0123456789".includes(character)) {
      return this.parseNumberLiteral();
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

  private makeTriviaToken(
    start: number,
    length: number,
    kind: TokenKind,
    error: TokenError | null = null
  ) {
    const token = new Token(start, length, kind, [], error);
    this.trivia.push(token);
  }

  private handleEndOfFile() {
    if (this.index === this.length) {
      return this.makeToken(this.index, 0, "EndOfFile");
    }

    return null;
  }

  private parseWhitespaceTrivia() {
    const start = this.index;

    while (true) {
      const token = this.peek();

      if (!token || !" \t\r\n".includes(token)) {
        break;
      }

      this.next();
    }

    const length = this.index + 1 - start;
    this.makeTriviaToken(start, length, "Whitespace");
  }

  private parseCommentTrivia() {
    const start = this.index;

    while (this.peek() && !this.peek()?.includes("\r\n")) {
      this.next();
    }

    const length = this.index + 1 - start;
    this.makeTriviaToken(start, length, "Comment");
  }

  private parseNumberLiteral() {
    const start = this.index;

    while (true) {
      const token = this.peek();

      if (!token || !"0123456789".includes(token)) {
        break;
      }

      this.next();
    }

    if (this.peek() && this.peek() === ".") {
      this.next();

      while (true) {
        const token = this.peek();

        if (!token || !"0123456789".includes(token)) {
          break;
        }

        this.next();
      }
    }

    const length = this.index + 1 - start;
    return this.makeToken(start, length, "NumberLiteral");
  }
}
