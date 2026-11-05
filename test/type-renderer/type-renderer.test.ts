import assert = require("assert");
import { Parser } from "../../src/parser";
import { TypeInferrer } from "../../src/server/type-inferrer";
import { TypeRenderer } from "../../src/server/type-renderer";

describe("TypeRenderer", () => {
  const parser = new Parser();
  const typeInferrer = new TypeInferrer();
  const typeRenderer = new TypeRenderer();

  const render = (document: string, symbolName: string) => {
    const ast = parser.parseSourceDocument(document);
    typeInferrer.infer(ast);

    const symbol = ast.scope.lookup(symbolName);
    if (!symbol) {
      throw new Error(`Symbol '${symbolName}' not found`);
    }

    return typeRenderer.render(symbol);
  };

  it("scalars", () => assert.equal(render("a = 3.5,", "a"), "number"));

  it("empty-table", () => assert.equal(render("x = {},", "x"), "{}"));

  it("flat-table", () =>
    assert.equal(
      render("x = { foo = 0, bar = function() {}, },", "x"),
      "{ foo: number; bar: function }",
    ));

  it("nested-table", () =>
    assert.equal(
      render('x = { foo = 0, nested = { inner = "hello", }, },', "x"),
      "{ foo: number; nested: { inner: string } }",
    ));

  it("quoted-key", () =>
    assert.equal(
      render('x = { "first name" = 1, "2x" = 2, },', "x"),
      '{ "first name": number; "2x": number }',
    ));

  it("unknown-member", () =>
    assert.equal(render("x = { y = null, },", "x"), "{ y: unknown }"));
});
