import { existsSync, readFileSync, writeFileSync } from "fs";
import { Parser } from "../src/parser";

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

const writeResult = (document: string, outFileName: string) => {
  const parser = new Parser();
  const node = parser.parseSourceDocument(document);

  const json = JSON.stringify(
    node,
    function (key, value) {
      if (["trivia"].includes(key)) {
        return;
      }

      return value;
    },
    2
  );

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
  console.log("USAGE: npm run utils:parser <tui-code>");
  console.log("USAGE: npm run utils:parser <file>\n");
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
}

if (document !== undefined) {
  const tests = getTests(document);

  tests.forEach((test) => {
    writeResult(test.document, `${outFileName ?? ""}${test.name}.tui.json`);
  });
}
