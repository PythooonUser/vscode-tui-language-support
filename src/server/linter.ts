import { TextDocument } from "vscode-languageserver-textdocument";
import {
  Diagnostic,
  DiagnosticSeverity,
  TextDocumentChangeEvent,
} from "vscode-languageserver/node";
import {
  MemberAccessExpressionNode,
  Node,
  SourceDocumentNode,
  VariableNode,
} from "../parser";
import { Scope } from "../parser/scope";
import { Symbol } from "../parser/symbol";

export class Linter {
  public lint(
    event: TextDocumentChangeEvent<TextDocument>,
    ast: SourceDocumentNode,
  ): Diagnostic[] {
    const diagnostics: Diagnostic[] = [];

    ast.walk((element) => {
      if (!element.error) return;

      let start = element.start;
      let length = element.length;
      let message = `ERROR: ${element.error}`;

      if (element.error === "UnexpectedEndOfFile") {
        if (element.parent.kind === "StringLiteralNode") {
          message = "Terminate this string with a closing character.";
        } else if (element.kind === "Comment") {
          message = "Terminate this block comment with closing characters.";
        }
      }

      if (element.error === "SkippedToken") {
        message = `Remove the skipped token '${element.content}'.`;
      }

      if (element.error === "MissingToken") {
        message = `Provide the missing character '${element.kind}' here.`;

        if (element.kind === "Index") {
          message = "Provide a valid index here.";
        } else if (element.kind === "RightBracketDelimiter") {
          message = "Close this expression with the missing ']' character.";
        } else if (element.kind === "RightBraceDelimiter") {
          message = "Close this expression with the missing '}' character.";
        } else if (element.kind === "RightParenDelimiter") {
          message = "Close this expression with the missing ')' character.";
        } else if (
          element.kind === "LeftBraceDelimiter" &&
          element.parent.kind === "CompoundStatementNode"
        ) {
          message = "Expected statements enclosed by '{ }'.";
        } else if (element.kind === "Expression") {
          message = "Provide a valid expression here.";

          // const parent = element.getParentOfKind("IfStatementNode");
          // if (parent) {
          //   message = "Provide a valid condition for this if-statement.";
          //   start = (parent as IfStatementNode).condition.start;
          //   length = (parent as IfStatementNode).condition.length;
          // }
        }
      }

      const diagnostic: Diagnostic = {
        severity: DiagnosticSeverity.Error,
        range: {
          start: event.document.positionAt(start),
          end: event.document.positionAt(start + length),
        },
        message,
        code: "100",
        source: "tui",
      };

      diagnostics.push(diagnostic);
    });

    this.checkForUndefinedSymbols(event, ast, diagnostics);

    return diagnostics;
  }

  private checkForUndefinedSymbols(
    event: TextDocumentChangeEvent<TextDocument>,
    ast: SourceDocumentNode,
    diagnostics: Diagnostic[],
  ) {
    const languageScope = new Scope();
    languageScope.define(new Symbol("vec2"));
    languageScope.define(new Symbol("vec3"));
    languageScope.define(new Symbol("vec4"));
    languageScope.define(new Symbol("mat3"));

    languageScope.define(new Symbol("print"));
    languageScope.define(new Symbol("error"));
    languageScope.define(new Symbol("exit"));
    languageScope.define(new Symbol("readValue"));
    languageScope.define(new Symbol("clear"));
    languageScope.define(new Symbol("system"));
    languageScope.define(new Symbol("platform"));
    languageScope.define(new Symbol("require"));
    languageScope.define(new Symbol("type"));

    const debugSymbol = new Symbol("debug");
    const debugSymbolMembers = new Scope();
    debugSymbolMembers.define(new Symbol("getFileName"));
    debugSymbolMembers.define(new Symbol("getLineNumber"));
    debugSymbolMembers.define(new Symbol("break"));
    debugSymbolMembers.define(new Symbol("backtrace"));
    debugSymbol.members = debugSymbolMembers;
    languageScope.define(debugSymbol);

    const tableSymbol = new Symbol("table");
    const tableSymbolMembers = new Scope();
    tableSymbolMembers.define(new Symbol("count"));
    tableSymbolMembers.define(new Symbol("insert"));
    tableSymbolMembers.define(new Symbol("remove"));
    tableSymbolMembers.define(new Symbol("shuffle"));
    tableSymbolMembers.define(new Symbol("sort"));
    tableSymbolMembers.define(new Symbol("clone"));
    tableSymbol.members = tableSymbolMembers;
    languageScope.define(tableSymbol);

    const stringSymbol = new Symbol("string");
    const stringSymbolMembers = new Scope();
    stringSymbolMembers.define(new Symbol("length"));
    stringSymbolMembers.define(new Symbol("format"));
    stringSymbolMembers.define(new Symbol("find"));
    stringSymbolMembers.define(new Symbol("subString"));
    stringSymbolMembers.define(new Symbol("sha1"));
    stringSymbolMembers.define(new Symbol("split"));
    stringSymbolMembers.define(new Symbol("replace"));
    stringSymbolMembers.define(new Symbol("lower"));
    stringSymbolMembers.define(new Symbol("upper"));
    stringSymbolMembers.define(new Symbol("eachChar"));
    stringSymbolMembers.define(new Symbol("eachLine"));
    stringSymbol.members = stringSymbolMembers;
    languageScope.define(stringSymbol);

    const fileSymbol = new Symbol("file");
    const fileSymbolMembers = new Scope();
    fileSymbolMembers.define(new Symbol("directoryContents"));
    fileSymbolMembers.define(new Symbol("load"));
    fileSymbolMembers.define(new Symbol("loadBinary"));
    fileSymbolMembers.define(new Symbol("save"));
    fileSymbolMembers.define(new Symbol("saveBinary"));
    fileSymbolMembers.define(new Symbol("loadData"));
    fileSymbolMembers.define(new Symbol("saveData"));
    fileSymbolMembers.define(new Symbol("sha1"));
    fileSymbolMembers.define(new Symbol("isDirectory"));
    fileSymbolMembers.define(new Symbol("fileName"));
    fileSymbolMembers.define(new Symbol("extension"));
    fileSymbolMembers.define(new Symbol("changeExtension"));
    fileSymbolMembers.define(new Symbol("removeExtension"));
    fileSymbolMembers.define(new Symbol("removeLastPathComponent"));
    fileSymbolMembers.define(new Symbol("getAbsolutePath"));
    fileSymbolMembers.define(new Symbol("isSubPath"));
    fileSymbolMembers.define(new Symbol("move"));
    fileSymbolMembers.define(new Symbol("copy"));
    fileSymbolMembers.define(new Symbol("remove"));
    fileSymbolMembers.define(new Symbol("mkdir"));
    fileSymbolMembers.define(new Symbol("fileExists"));
    fileSymbolMembers.define(new Symbol("isSymLink"));
    fileSymbolMembers.define(new Symbol("createDirectoriesIfNeededForDirPath"));
    fileSymbolMembers.define(
      new Symbol("createDirectoriesIfNeededForFilePath"),
    );
    fileSymbol.members = fileSymbolMembers;
    languageScope.define(fileSymbol);

    const mathSymbol = new Symbol("math");
    const mathSymbolMembers = new Scope();
    mathSymbolMembers.define(new Symbol("random"));
    mathSymbolMembers.define(new Symbol("randomInt"));
    mathSymbolMembers.define(new Symbol("sqrt"));
    mathSymbolMembers.define(new Symbol("exp"));
    mathSymbolMembers.define(new Symbol("log"));
    mathSymbolMembers.define(new Symbol("log10"));
    mathSymbolMembers.define(new Symbol("floor"));
    mathSymbolMembers.define(new Symbol("ceil"));
    mathSymbolMembers.define(new Symbol("fmod"));
    mathSymbolMembers.define(new Symbol("pow"));
    mathSymbolMembers.define(new Symbol("abs"));
    mathSymbolMembers.define(new Symbol("max"));
    mathSymbolMembers.define(new Symbol("min"));
    mathSymbolMembers.define(new Symbol("clamp"));
    mathSymbolMembers.define(new Symbol("mix"));
    mathSymbolMembers.define(new Symbol("sin"));
    mathSymbolMembers.define(new Symbol("cos"));
    mathSymbolMembers.define(new Symbol("tan"));
    mathSymbolMembers.define(new Symbol("asin"));
    mathSymbolMembers.define(new Symbol("acos"));
    mathSymbolMembers.define(new Symbol("atan"));
    mathSymbolMembers.define(new Symbol("atan2"));
    mathSymbolMembers.define(new Symbol("length"));
    mathSymbolMembers.define(new Symbol("length2"));
    mathSymbolMembers.define(new Symbol("normalize"));
    mathSymbolMembers.define(new Symbol("dot"));
    mathSymbolMembers.define(new Symbol("cross"));
    mathSymbolMembers.define(new Symbol("rotate"));
    mathSymbol.members = mathSymbolMembers;
    languageScope.define(mathSymbol);

    const documentScope = ast.scope;
    documentScope.parent = languageScope;
    ast.scope = languageScope;

    ast.walk((nodeOrToken) => {
      if (nodeOrToken instanceof Node) {
        if (nodeOrToken.kind === "VariableNode") {
          const symbol = nodeOrToken as VariableNode;
          if (!symbol.scope.lookup(symbol.name.content)) {
            const diagnostic: Diagnostic = {
              severity: DiagnosticSeverity.Warning,
              range: {
                start: event.document.positionAt(symbol.name.start),
                end: event.document.positionAt(
                  symbol.name.start + symbol.name.length,
                ),
              },
              message: `Undefined symbol '${symbol.name.content}'.`,
              code: "undefined-symbol",
              source: "tui",
            };

            diagnostics.push(diagnostic);
          }
        } else if (nodeOrToken.kind === "MemberAccessExpressionNode") {
          const memberAccess = nodeOrToken as MemberAccessExpressionNode;
          let baseNode: Node = memberAccess.expression;
          while (baseNode.kind === "MemberAccessExpressionNode") {
            baseNode = (baseNode as MemberAccessExpressionNode).expression;
          }

          if (baseNode.kind === "VariableNode") {
            const baseVariableNode = baseNode as VariableNode;
            const symbol = baseVariableNode.scope.lookup(
              baseVariableNode.name.content,
            );

            if (
              !symbol ||
              !symbol.members?.lookup(memberAccess.member.content)
            ) {
              const diagnostic: Diagnostic = {
                severity: DiagnosticSeverity.Warning,
                range: {
                  start: event.document.positionAt(memberAccess.member.start),
                  end: event.document.positionAt(
                    memberAccess.member.start + memberAccess.member.length,
                  ),
                },
                message: `Undefined member '${memberAccess.member.content}'.`,
                code: "undefined-symbol",
                source: "tui",
              };

              diagnostics.push(diagnostic);
            }
          }
        }
      }
    });
  }
}
