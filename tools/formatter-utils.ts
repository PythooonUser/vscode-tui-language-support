import { existsSync, readFileSync, writeFileSync } from "fs";
import { Parser } from "../src/parser";
import { TextDocument } from "vscode-languageserver-textdocument";
import { Formatter, FormatterOptions } from "../src/server/formatter";

const getTests = (document: string) => {
  const tests: { name: string; options: FormatterOptions; document: string }[] =
    [];
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

const writeResult = (
  document: string,
  options: FormatterOptions,
  outFileName: string,
) => {
  const parser = new Parser();
  const node = parser.parseSourceDocument(document);

  const textDocument = TextDocument.create("uri", "tui", 1, document);
  const formatter = new Formatter();
  const edits = formatter.format(textDocument, node, options);
  const result = TextDocument.applyEdits(textDocument, edits);

  if (outFileName) {
    writeFileSync(outFileName, result);
    console.log(`Output written to: '${outFileName}'`);
  } else {
    console.log(`Output:\n${result}`);
  }
};

const args = process.argv;
let document: string | undefined = undefined;
let outFileName: string | undefined = undefined;

if (args.length < 3) {
  console.log("USAGE: npm run utils:formatter <file>");
  console.log("  --no-tests: Only convert source to formatted version\n");
  console.log(
    "(Remember to call it like npm run utils:formatter -- --no-tests <file>)\n",
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

    writeResult(
      document || "",
      { "null-literal": "null" },
      `${outFileName ?? ""}.formatted.tui`,
    );
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
            test.options,
            `${outFileName ?? ""}${test.name}.formatted.tui`,
          );
        }
      });
    }
  }
}
