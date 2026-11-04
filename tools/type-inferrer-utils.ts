import { Parser, Token } from "../src/parser";
import { TypeInferrer } from "../src/server/type-inferrer";
import { existsSync, readFileSync, writeFileSync } from "fs";

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
  new TypeInferrer().infer(node);

  const json = JSON.stringify(
    node.scope,
    function (key, value) {
      if (["_parent", "initializer"].includes(key)) {
        return;
      }

      if (key === "name" && this[key] instanceof Token) {
        return this[key].content;
      }

      return value;
    },
    2,
  );

  writeFileSync(outFileName, `${json}\n`);
  console.log(`Output written to: '${outFileName}'`);
};

const args = process.argv;
let document: string | undefined = undefined;

if (args.length < 2) {
  console.log("USAGE: npm run utils:type-inferrer <file>");
} else if (existsSync(args[2])) {
  document = readFileSync(args[2], "utf-8");

  if (document !== undefined) {
    const tests = getTests(document);

    tests.forEach((test) => {
      if (!test.name.endsWith(".skip")) {
        writeResult(
          test.document,
          `${args[2].replace(/[a-zA-Z0-9-]+\.tui/, "")}/${test.name}.scope.json`,
        );
      }
    });
  }
} else {
  console.log(`File '${args[2]}' does not exist!`);
}
