import { readdirSync, readFileSync } from "fs";
import { TextDocument } from "vscode-languageserver-textdocument";
import { Parser } from "../../src/parser";
import { Formatter, FormatterOptions } from "../../src/server/formatter";
import assert from "assert";

describe("Formatter", () => {
  const parser: Parser = new Parser();
  const formatter: Formatter = new Formatter();

  const getTests = (document: string) => {
    const tests: {
      name: string;
      options: FormatterOptions;
      document: string;
    }[] = [];
    const matches = document
      .split(/^(#\s[a-zA-Z0-9-.]+)\s(.+)$/m)
      .map((match) => match.trim())
      .filter((match) => !!match);

    for (let i = 0; i < matches.length; i += 3) {
      tests.push({
        name: matches[i].replace(/#/, "").trim(),
        options: JSON.parse(matches[i + 1]),
        document: matches[i + 2].trim(),
      });
    }

    return tests;
  };

  const getDocument = (path: string) => readFileSync(path, "utf-8");

  const format = (document: string, options: FormatterOptions) => {
    const ast = parser.parseSourceDocument(document);
    const textDocument = TextDocument.create("uri", "tui", 1, document);
    const edits = formatter.format(textDocument, ast, options);

    return TextDocument.applyEdits(textDocument, edits);
  };

  describe("Formatter Tests", () => {
    const names = readdirSync("test/formatter")
      .filter(
        (name) => name.endsWith(".tui") && !name.endsWith(".formatted.tui"),
      )
      .map((name) => name.replace(".tui", ""));

    names.forEach((name) => {
      const document = getDocument(`test/formatter/${name}.tui`);
      const tests = getTests(document);

      tests.forEach((test) => {
        if (test.name.endsWith(".skip")) {
          it.skip(test.name.replace(".skip", ""));
          return;
        }

        it(test.name, () => {
          const actual = format(test.document, test.options);
          const expected = getDocument(
            `test/formatter/${test.name}.formatted.tui`,
          );

          assert.strictEqual(actual, expected);
        });
      });
    });
  });
});
