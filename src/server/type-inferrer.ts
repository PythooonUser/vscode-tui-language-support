import {
  CallExpressionNode,
  Node,
  SourceDocumentNode,
  VariableNode,
} from "../parser";
import { Scope } from "../parser/scope";
import { Symbol } from "../parser/symbol";
import { SymbolType } from "../parser/symbol-type";

/**
 * Infers the types of the symbols of a parsed source document in a separate
 * pass over the AST. The parser only records the initializer expression of
 * every symbol it defines, the actual types are deducted here.
 */
export class TypeInferrer {
  /**
   * Infers the types of all symbols in a parsed source document.
   *
   * @param ast The root node for the AST.
   */
  public infer(ast: SourceDocumentNode): void {
    this.inferScope(ast.scope);
  }

  private inferScope(scope: Scope): void {
    for (const symbol of scope.symbols) {
      this.inferSymbol(symbol);
    }

    for (const child of scope.children) {
      this.inferScope(child);
    }
  }

  private inferSymbol(symbol: Symbol): void {
    if (symbol.initializer) {
      symbol.type = this.inferSymbolType(symbol.initializer);
    }

    if (symbol.members) {
      this.inferScope(symbol.members);
    }

    if (symbol.arrayElements) {
      for (const arrayElement of symbol.arrayElements) {
        this.inferSymbol(arrayElement);
      }
    }
  }

  private inferSymbolType(node: Node): SymbolType {
    switch (node.kind) {
      case "BoolLiteralNode":
        return "boolean";
      case "NumberLiteralNode":
        return "number";
      case "StringLiteralNode":
        return "string";
      case "TableLiteralNode":
        return "table";
      case "FunctionDeclarationNode":
        return "function";
      case "CallExpressionNode": {
        const expression = (node as CallExpressionNode).expression;

        if (expression.kind === "VariableNode") {
          switch ((expression as VariableNode).name.content) {
            case "vec2":
              return "vec2";
            case "vec3":
              return "vec3";
            case "vec4":
              return "vec4";
            case "mat3":
              return "mat3";
            default:
              return "unknown";
          }
        }

        return "unknown";
      }
      default:
        return "unknown";
    }
  }
}
