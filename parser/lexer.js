// @ts-check

const { Token } = require("./token");
const { TokenError } = require("./token-error");
const { TokenKind } = require("./token-kind");

/** Generates a stream of Token objects from a source document. */
class Lexer {
  constructor() {
    /** The input source document. */
    this.document = "";
    /** The maximum index in the source document. */
    this.length = 0;
    /** The current index in the source document. */
    this.index = -1;
    /** @type {Token[]} The current whitespace or comment trivia Token objects. */
    this.trivia = [];
    /** @type {Token[]} The currently cached tokens when used a look ahead previously. */
    this.tokens = [];
  }

  /**
   * Provides an input document and resets the internal state.
   *
   * @param {string} document The input document.
   */
  reset(document) {
    this.document = document;
    this.length = document.length;
    this.index = -1;
    this.trivia = [];
    this.tokens = [];
  }

  /**
   * Returns the next token in the source document.
   *
   * @return {Token|null} The next Token object in the source document.
   */
  advance() {
    if (this.tokens.length > 0) {
      const token = this.tokens[0];
      this.tokens = this.tokens.slice(1);
      return token;
    }

    return this._load();
  }

  /**
   * Returns the next token in the source document ignoring cached tokens.
   *
   * @return {Token|null} The next Token object in the source document.
   */
  _load() {
    let character = this._next();

    if (character === null) {
      return this._handleEndOfFile();
    }

    return this._makeToken(
      this.index,
      1,
      TokenKind.UnknownToken,
      TokenError.UnknownToken
    );
  }

  /**
   * Handles end of file.
   *
   * @return {Token|null} The end of file Token object or null.
   */
  _handleEndOfFile() {
    if (this.index === this.length) {
      return this._makeToken(this.index, 0, TokenKind.EndOfFile);
    }

    return null;
  }

  /**
   * Returns the next character in the source document and advances the internal state.
   *
   * @return {string|null} The next character in the source document.
   */
  _next() {
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

  /**
   * Creates a new Token object.
   *
   * @param {number} start The start index of the token.
   * @param {number} length The length of the token.
   * @param {TokenKind} kind The kind of token.
   * @param {TokenError|undefined} error The error of token in case of parse issues.
   * @return {Token} The Token object created.
   */
  _makeToken(start, length, kind, error = undefined) {
    const token = new Token(start, length, kind, this.trivia, error);
    this.trivia = [];
    return token;
  }
}

exports.Lexer = Lexer;
