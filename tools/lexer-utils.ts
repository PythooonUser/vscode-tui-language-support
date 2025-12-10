import { existsSync, readFileSync, writeFileSync } from "fs";
import { Lexer, Token } from "../src/parser";

const writeResult = (document: string, outFileName: string | undefined) => {
  const lexer = new Lexer();
  lexer.reset(document);

  const tokens: Token[] = [];
  let token = lexer.advance();

  while (token) {
    tokens.push(token);
    token = lexer.advance();
  }

  const json = JSON.stringify(tokens, null, 2);

  if (outFileName !== undefined) {
    writeFileSync(outFileName, `${json}\n`);
    console.log(`Output written to: '${outFileName}'`);
  } else {
    console.log(json);
  }
};

const args = process.argv;
let document: string | undefined = undefined;
let outFileName: string | undefined = undefined;

if (args.length < 3) {
  console.log("USAGE: npm run utils:lexer <tui-code>");
  console.log("USAGE: npm run utils:lexer <file>\n");
} else {
  if (args[2].endsWith(".tui")) {
    if (existsSync(args[2])) {
      document = readFileSync(args[2], "utf-8");
      outFileName = args[2].replace(".tui", ".tui.json");
    } else {
      console.log(`File '${args[2]}' does not exist!`);
    }
  } else {
    document = args[2];
  }
}

if (document !== undefined) {
  writeResult(document, outFileName);
}
