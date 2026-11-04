import assert = require("assert");
import { Parser, Token } from "../../src/parser";
import { Scope } from "../../src/parser/scope";
import { TypeInferrer } from "../../src/server/type-inferrer";
import { existsSync, readdirSync, readFileSync } from "fs";

describe("TypeInferrer", () => {
  const parser = new Parser();
  const typeInferrer = new TypeInferrer();

  const infer = (document: string) => {
    const node = parser.parseSourceDocument(document);
    typeInferrer.infer(node);

    return node.scope;
  };

  const serialize = (value: unknown) =>
    JSON.parse(
      JSON.stringify(value, function (key, value) {
        if (["_parent", "initializer"].includes(key)) {
          return;
        }

        if (key === "name" && this[key] instanceof Token) {
          return this[key].content;
        }

        return value;
      }),
    );

  const getDocument = (path: string) => readFileSync(path, "utf-8");

  const getTests = (document: string) => {
    const tests: { name: string; document: string }[] = [];
    const matches = document
      .split(/(^#\s[a-zA-Z0-9-.]+$)/m)
      .map((match) => match.trim())
      .filter((match) => !!match);

    for (let i = 0; i < matches.length; i += 2) {
      tests.push({
        name: matches[i].replace(/#/, "").trim(),
        document: matches[i + 1].trim(),
      });
    }

    return tests;
  };

  const getJSON = (path: string) => {
    if (!existsSync(path)) {
      throw new Error(
        `File '${path}' does not exist. Did you forget to run '$ npm run utils:type-inferrer ${path.replace(
          ".json",
          ".tui",
        )}'?`,
      );
    }

    return JSON.parse(readFileSync(path, "utf-8"));
  };

  const names = readdirSync("test/type-inferrer")
    .filter((name: string) => name.endsWith(".tui"))
    .map((name: string) => name.replace(".tui", ""));

  names.forEach((name) => {
    if (name.endsWith(".skip")) {
      it.skip(`${name.replace(".skip", "")}.tui`);
      return;
    }

    describe(name, () => {
      const document = getDocument(`test/type-inferrer/${name}.tui`);
      const tests = getTests(document);

      tests.forEach((test) => {
        if (test.name.endsWith(".skip")) {
          it.skip(test.name.replace(".skip", ""));
          return;
        }

        it(test.name, () => {
          const actual = infer(test.document);

          assert.deepEqual(
            serialize(actual),
            getJSON(`test/type-inferrer/${test.name}.scope.json`) as Scope,
          );
        });
      });
    });
  });
});
