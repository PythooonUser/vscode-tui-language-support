import assert = require("assert");
import { Parser } from "../../src/parser";
import { HoverResolver } from "../../src/server/hover-resolver";
import { TypeInferrer } from "../../src/server/type-inferrer";
import { MarkupContent } from "vscode-languageserver/node";

describe("HoverResolver", () => {
  const parser = new Parser();
  const typeInferrer = new TypeInferrer();
  const hoverResolver = new HoverResolver();

  const hover = (document: string, symbolName: string) => {
    const ast = parser.parseSourceDocument(document);
    typeInferrer.infer(ast);

    const resolved = hoverResolver.resolve(document.indexOf(symbolName), ast);
    if (!resolved) {
      throw new Error("Expected hover to be resolved");
    }

    return (resolved.contents as MarkupContent).value;
  };

  it("table-structure", () =>
    assert.equal(
      hover("x = { foo = 0, bar = function() {}, },", "x"),
      "```tui-type\n(variable) x: {\n  foo: number;\n  bar: function\n}\n```",
    ));

  it("empty-table", () =>
    assert.equal(hover("x = {},", "x"), "```tui-type\n(variable) x: {}\n```"));

  it("table-member", () =>
    assert.equal(
      hover("x = { bar = function() {}, },", "bar"),
      "```tui-type\n(method) bar: function\n```",
    ));

  it("parameter", () =>
    assert.equal(
      hover("f = function(a) {},", "a"),
      "```tui-type\n(parameter) a: unknown\n```",
    ));

  it("unknown-variable", () =>
    assert.equal(hover("z,", "z"), "```tui-type\n(variable) z: unknown\n```"));

  it("name", () =>
    assert.equal(
      hover("debug.backtrace,", "backtrace"),
      "```tui-type\n(name) backtrace: unknown\n```",
    ));
});
