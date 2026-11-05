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
      "{\n  foo: number;\n  bar: function\n}",
    ));

  it("nested-table", () =>
    assert.equal(
      render('x = { foo = 0, nested = { inner = "hello", }, },', "x"),
      "{\n  foo: number;\n  nested: {\n    inner: string\n  }\n}",
    ));

  it("quoted-key", () =>
    assert.equal(
      render('x = { "first name" = 1, "2x" = 2, },', "x"),
      '{\n  "first name": number;\n  "2x": number\n}',
    ));

  it("unknown-member", () =>
    assert.equal(render("x = { y = null, },", "x"), "{\n  y: unknown\n}"));

  it("array-elements", () =>
    assert.equal(render("x = { 1, 2, 3 },", "x"), "{\n  number\n}"));

  it("heterogeneous-array-elements", () =>
    assert.equal(
      render('x = { 1, "a", true, },', "x"),
      "{\n  number;\n  string;\n  boolean\n}",
    ));

  it("members-and-array-elements", () =>
    assert.equal(
      render("x = { foo = 0, 1, },", "x"),
      "{\n  foo: number;\n  number\n}",
    ));

  it("nested-array-elements", () =>
    assert.equal(
      render("x = { { 1, 2 }, { 3, 4 }, },", "x"),
      "{\n  {\n    number\n  }\n}",
    ));
});
