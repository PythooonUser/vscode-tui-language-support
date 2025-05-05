import assert = require("assert");
import { Parser, SourceDocumentNode } from "../../src/parser";
import { existsSync, readdirSync, readFileSync } from "fs";

describe("Parser", () => {
  const parser: Parser = new Parser();

  const parseSourceDocument = (document: string) =>
    parser.parseSourceDocument(document);

  const assertNodesEqual = (
    actual: SourceDocumentNode,
    expected: SourceDocumentNode
  ) => {
    assert.strictEqual(
      JSON.parse(
        JSON.stringify(actual, (key, value) => {
          if (["parent", "trivia", "document"].includes(key)) {
            return;
          }

          return value;
        })
      ),
      expected
    );
  };

  const getDocument = (path: string) => readFileSync(path, "utf-8");

  const getTests = (document: string) => {
    const tests: { name: string; document: string }[] = [];
    const matches = document
      .split(/(^\/\/\s[a-zA-Z0-9-]+$)/m)
      .map((match) => match.trim())
      .filter((match) => !!match);

    for (let i = 0; i < matches.length; i += 2) {
      tests.push({
        name: matches[i].replace(/\/\//, "").trim(),
        document: matches[i + 1].trim(),
      });
    }

    return tests;
  };

  const getJSON = (path: string) => {
    if (!existsSync(path)) {
      throw new Error(
        `File '${path}' does not exist. Did you forget to run '$ npm run utils:parser ${path.replace(
          ".json",
          ""
        )}'?`
      );
    }

    return JSON.parse(readFileSync(path, "utf-8")) as SourceDocumentNode;
  };

  describe("Parser Tests", () => {
    describe("end-of-file", () => {
      it("end-of-file", () => {
        const actual = parseSourceDocument("");
        const expected = {
          kind: "SourceDocumentNode",
          error: null,
          statements: [],
          endOfFile: {
            start: 0,
            length: 0,
            kind: "EndOfFile",
            error: null,
          },
        } as unknown as SourceDocumentNode;

        assertNodesEqual(actual, expected);
      });
    });

    const names = readdirSync("test/parser/parser")
      .filter((name: string) => name.endsWith(".tui"))
      .map((name: string) => name.replace(".tui", ""));

    names.forEach((name) => {
      if (name.endsWith(".skip")) {
        it.skip(`${name.replace(".skip", "")}.tui`);
      } else {
        describe(name, () => {
          const document = getDocument(`test/parser/parser/${name}.tui`);
          const tests = getTests(document);

          tests.forEach((test) => {
            if (test.name.endsWith(".skip")) {
              it.skip(test.name.replace(".skip", ""));
            }

            it(test.name, () => {
              const actual = parseSourceDocument(test.document);
              const expected = getJSON(
                `test/parser/parser/${test.name}.tui.json`
              );

              assertNodesEqual(actual, expected);
            });
          });
        });
      }
    });
  });
});
