import { existsSync, readdirSync, readFileSync } from "fs";
import { Lexer, Token, OptionalToken } from "../../src/parser";
import assert = require("assert");

describe("Lexer", () => {
  const lexer: Lexer = new Lexer();

  const assertTokensEqual = (actual: OptionalToken, expected: Token) => {
    assert(actual instanceof Token);

    // We made sure we fail the above test if `actual` comes in `null`.
    actual = actual as Token;

    assert.strictEqual(actual.start, expected.start);
    assert.strictEqual(actual.length, expected.length);
    assert.strictEqual(actual.kind, expected.kind);
    assertTokenArraysEqual(actual.trivia, expected.trivia);
    assert.strictEqual(actual.error, expected.error);
  };

  const assertTokenArraysEqual = (actual: Token[], expected: Token[]) => {
    assert.strictEqual(actual.length, expected.length);

    for (let i = 0; i < expected.length; i++) {
      assertTokensEqual(actual[i], expected[i]);
    }
  };

  const getTokens = (document: string) => {
    lexer.reset(document);

    const tokens: Token[] = [];
    let token = lexer.advance();

    while (token) {
      tokens.push(token);
      token = lexer.advance();
    }

    return tokens;
  };

  const getDocument = (path: string) => readFileSync(path, "utf-8");

  const getJSON = (path: string) => {
    if (!existsSync(path)) {
      throw new Error(
        `File '${path}' does not exist. Did you forget to run '$ npm run utils:lexer ${path.replace(
          ".json",
          ""
        )}'?`
      );
    }

    return JSON.parse(readFileSync(path, "utf-8")) as Token[];
  };

  describe("Lexer Tests", () => {
    const names = readdirSync("test/parser/lexer")
      .filter((name) => name.endsWith(".tui"))
      .map((name) => name.replace(".tui", ""));

    names.forEach((name) => {
      if (name.endsWith(".skip")) {
        it.skip(name.replace(".skip", ""));
      } else {
        it(`${name}`, () => {
          const document = getDocument(`test/parser/lexer/${name}.tui`);
          const actual = getTokens(document);
          const expected = getJSON(`test/parser/lexer/${name}.tui.json`);

          assertTokenArraysEqual(actual, expected);
        });
      }
    });
  });
});
