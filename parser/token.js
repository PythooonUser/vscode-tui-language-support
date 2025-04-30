// @ts-check

const { TokenKind } = require("./token-kind");
const { TokenError } = require("./token-error");

class Token {
  /**
   * @param {number} start
   * @param {number} length
   * @param {TokenKind} kind
   * @param {Token[]|undefined} trivia
   * @param {TokenError|undefined} error
   */
  constructor(start, length, kind, trivia, error) {
    /** @type {number} */
    this.start = start;
    /** @type {number} */
    this.length = length;
    /** @type {TokenKind} */
    this.kind = kind;
    /** @type {TokenError[]} */
    this.trivia = trivia || [];
    /** @type {TokenError|null} */
    this.error = error || null;
  }
}

exports.Token = Token;
