import { Token } from "./token";
import { TokenError } from "./token-error";
import {
  DelimiterTokenMap,
  KeywordTokenMap,
  OperatorTokenMap,
  TokenKind,
} from "./token-kind";
import { OptionalToken } from "./types";

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

  private load(): OptionalToken {
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

    if (
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_".includes(
        character
      )
    ) {
      return this.parseName();
    }

    if ("0123456789".includes(character)) {
      return this.parseNumberLiteral();
    }

    if ("\"'".includes(character)) {
      return this.parseStringLiteral(character);
    }

    if ("<>+-&|!=/*:?.".includes(character)) {
      return this.parseOperator();
    }

    if ("()[]{},".includes(character)) {
      return this.parseDelimiter();
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

    while (this.peek() && !"\r\n".includes(this.peek() || "")) {
      this.next();
    }

    const length = this.index + 1 - start;
    this.makeTriviaToken(start, length, "Comment");
  }

  private parseName() {
    const start = this.index;

    while (true) {
      const token = this.peek();

      if (
        !token ||
        !"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_".includes(
          token
        )
      ) {
        break;
      }

      this.next();
    }

    const length = this.index + 1 - start;
    const content = this.document.slice(start, start + length);
    const kind = KeywordTokenMap[content];

    return this.makeToken(start, length, kind ? kind : "Name");
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

  private parseStringLiteral(type: string) {
    const start = this.index;
    let error: TokenError | null = null;

    while (true) {
      if (!this.peek()) {
        error = "UnexpectedEndOfFile";
        break;
      }

      if (this.peek() === type) {
        break;
      }

      this.next();
    }

    if (this.peek()) {
      this.next(); // Consume either ' or " (see `type`).
    }

    const length = this.index + 1 - start;
    return this.makeToken(start, length, "StringLiteral", error);
  }

  private parseOperator() {
    const start = this.index;

    const firstCharacter = this.document[this.index];
    let kind = OperatorTokenMap[firstCharacter];

    if (firstCharacter === ".") {
      while (true) {
        const token = this.peek();

        if (token !== ".") {
          break;
        }

        this.next();
      }
    } else {
      const secondCharacter = this.peek();
      if (secondCharacter && "<>+-&|=".includes(secondCharacter)) {
        const extendedKind = OperatorTokenMap[firstCharacter + secondCharacter];
        if (extendedKind) {
          this.next(); // Consume second part of operator.
          kind = extendedKind;
        }
      }
    }

    const length = this.index + 1 - start;
    return this.makeToken(start, length, kind);
  }

  private parseDelimiter() {
    const start = this.index;

    const character = this.document[this.index];
    const kind = DelimiterTokenMap[character];

    const length = this.index + 1 - start;
    return this.makeToken(start, length, kind);
  }
}
