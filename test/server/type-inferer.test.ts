import assert = require("assert");
import { Parser } from "../../src/parser";
import { TypeInferer } from "../../src/server/type-inferer";

describe("TypeInferer", () => {
  const parser = new Parser();

  const inferTypes = (document: string) => {
    const ast = parser.parseSourceDocument(document);
    new TypeInferer().infer(ast);

    return ast.scope;
  };

  it("infers literal types", () => {
    const scope = inferTypes(
      `x = 1, s = "text", b = true, t = {}, f = function() { }`,
    );

    assert.equal(scope.lookup("x")!.type, "number");
    assert.equal(scope.lookup("s")!.type, "string");
    assert.equal(scope.lookup("b")!.type, "boolean");
    assert.equal(scope.lookup("t")!.type, "table");
    assert.equal(scope.lookup("f")!.type, "function");
  });

  it("infers built-in call types", () => {
    const scope = inferTypes(
      `v2 = vec2(), v3 = vec3(), v4 = vec4(), m = mat3()`,
    );

    assert.equal(scope.lookup("v2")!.type, "vec2");
    assert.equal(scope.lookup("v3")!.type, "vec3");
    assert.equal(scope.lookup("v4")!.type, "vec4");
    assert.equal(scope.lookup("m")!.type, "mat3");
  });

  it("infers unknown for other calls", () => {
    const scope = inferTypes(`x = print("text")`);

    assert.equal(scope.lookup("x")!.type, "unknown");
  });

  it("keeps the type of the first assignment", () => {
    const scope = inferTypes(`x = 1, x = "text"`);

    assert.equal(scope.lookup("x")!.type, "number");
  });

  it("infers table member types", () => {
    const scope = inferTypes(`t = { "a": 1 }`);

    assert.equal(scope.lookup("t")!.type, "table");
    assert.equal(scope.lookup("t")!.members!.lookup("a")!.type, "number");
  });

  it("infers global symbol types from within functions", () => {
    const scope = inferTypes(`f = function() { .x = 2 }`);

    assert.equal(scope.lookup("x")!.type, "number");
  });
});
