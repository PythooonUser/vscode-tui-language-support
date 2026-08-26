import { existsSync, readFileSync, writeFileSync } from "fs";
import { Parser } from "../src/parser";
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

const writeResult = (document: string, outFileName: string) => {
  const parser = new Parser();
  const node = parser.parseSourceDocument(document);
  const linter = new Linter();
  const results = linter.lint(
    { document: TextDocument.create("uri", "tui", 1, document) },
    node,
  );

  const json = JSON.stringify(results, null, 2);

  if (outFileName) {
    writeFileSync(outFileName, `${json}\n`);
    console.log(`Output written to: '${outFileName}'`);
  } else {
    console.log(`Output:\n${json}`);
  }
};

const args = process.argv;
let document: string | undefined = undefined;
let outFileName: string | undefined = undefined;

if (args.length < 3) {
  console.log("USAGE: npm run utils:linter <file>");
  console.log(
    "  --no-tests: Only convert source to linter diagnostics (JSON)\n",
  );
  console.log(
    "(Remember to call it like npm run utils:linter -- --no-tests <file>)\n",
  );
} else {
  if (args[2] === "--no-tests") {
    if (args[3].endsWith(".tui")) {
      if (existsSync(args[3])) {
        document = readFileSync(args[3], "utf-8");
        outFileName = args[3];
      } else {
        console.log(`File '${args[3]}' does not exist!`);
      }
    } else {
      document = args[3];
    }

    writeResult(document || "", `${outFileName ?? ""}.json`);
  } else {
    if (args[2].endsWith(".tui")) {
      if (existsSync(args[2])) {
        document = readFileSync(args[2], "utf-8");
        outFileName = args[2].replace(/[a-zA-Z0-9-]+\.tui/, "");
      } else {
        console.log(`File '${args[2]}' does not exist!`);
      }
    } else {
      document = args[2];
    }

    if (document !== undefined) {
      const tests = getTests(document);

      tests.forEach((test) => {
        if (!test.name.endsWith(".skip")) {
          writeResult(
            test.document,
            `${outFileName ?? ""}${test.name}.tui.json`,
          );
        }
      });
    }
  }
}
