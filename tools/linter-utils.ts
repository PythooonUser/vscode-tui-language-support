import { existsSync, readFileSync, writeFileSync } from "fs";
import { Parser, Token } from "../src/parser";
import { Linter } from "../src/server/linter";
import { TextDocument } from "vscode-languageserver-textdocument";

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

const writeResult = (document: string, testName: string) => {
  const parser = new Parser();
  const node = parser.parseSourceDocument(document);
  const linter = new Linter();
  const results = linter.lint(
    { document: TextDocument.create("uri", "tui", 1, document) },
    node,
    // TODO: We could add a test option to overwrite this
    { globals: [] },
  );

  writeFileSync(
    `${testName}.diagnostics.json`,
    `${JSON.stringify(results, null, 2)}\n`,
  );

  writeFileSync(
    `${testName}.scope.json`,
    `${JSON.stringify(
      node.scope,
      function (key, value) {
        if (["_parent"].includes(key)) {
          return;
        }

        if (key === "name" && this[key] instanceof Token) {
          return this[key].content;
        }

        return value;
      },
      2,
    )}\n`,
  );
};

const args = process.argv;
let document: string | undefined = undefined;

if (args.length < 2) {
  console.log("USAGE: npm run utils:linter <file>");
} else {
  if (existsSync(args[2])) {
    document = readFileSync(args[2], "utf-8");
  } else {
    console.log(`File '${args[2]}' does not exist!`);
  }

  if (document !== undefined) {
    const tests = getTests(document);

    tests.forEach((test) => {
      if (!test.name.endsWith(".skip")) {
        writeResult(
          test.document,
          `${args[2].replace(/[a-zA-Z0-9-]+\.tui/, "")}/${test.name}`,
        );
      }
    });
  }
}
