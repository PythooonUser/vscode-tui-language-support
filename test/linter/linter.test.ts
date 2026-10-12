import assert = require("assert");
import { Parser, SourceDocumentNode, Token } from "../../src/parser";
import { Scope } from "../../src/parser/scope";
import { existsSync, readdirSync, readFileSync } from "fs";
import { Linter } from "../../src/server/linter";
import { TextDocument } from "vscode-languageserver-textdocument";
import { Diagnostic } from "vscode-languageserver-protocol";

describe("Linter", () => {
  const lint = (document: string) => {
    const parser: Parser = new Parser();
    const linter: Linter = new Linter();
    const node: SourceDocumentNode = parser.parseSourceDocument(document);
    const diagnostics: Diagnostic[] = linter.lint(
      { document: TextDocument.create("uri", "tui", 1, document) },
      node,
      {},
    );

    return { diagnostics, scope: node.scope };
  };

  const serialize = (value: unknown) =>
    JSON.parse(
      JSON.stringify(value, function (key, value) {
        if (["_parent"].includes(key)) {
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
        `File '${path}' does not exist. Did you forget to run '$ npm run utils:linter ${path.replace(
          ".json",
          ".tui",
        )}'?`,
      );
    }

    return JSON.parse(readFileSync(path, "utf-8"));
  };

  const names = readdirSync("test/linter")
    .filter((name: string) => name.endsWith(".tui"))
    .map((name: string) => name.replace(".tui", ""));

  names.forEach((name) => {
    if (name.endsWith(".skip")) {
      it.skip(`${name.replace(".skip", "")}.tui`);
      return;
    }

    describe(name, () => {
      const document = getDocument(`test/linter/${name}.tui`);
      const tests = getTests(document);

      tests.forEach((test) => {
        if (test.name.endsWith(".skip")) {
          it.skip(test.name.replace(".skip", ""));
          return;
        }

        it(test.name, () => {
          const actual = lint(test.document);

          assert.deepEqual(
            serialize(actual.diagnostics),
            getJSON(
              `test/linter/${test.name}.diagnostics.json`,
            ) as Diagnostic[],
          );
          assert.deepEqual(
            serialize(actual.scope),
            getJSON(`test/linter/${test.name}.scope.json`) as Scope,
          );
        });
      });
    });
  });
});
