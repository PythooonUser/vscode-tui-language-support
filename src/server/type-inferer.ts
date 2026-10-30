import {
  BinaryExpressionNode,
  CallExpressionNode,
  ForStatementNode,
  Node,
  SourceDocumentNode,
  StringLiteralNode,
  TableLiteralNode,
  UnaryExpressionNode,
  VariableNode,
} from "../parser";
import { Scope } from "../parser/scope";
import { Symbol } from "../parser/symbol";
import { SymbolType } from "../parser/symbol-type";
import { VariableAssignmentKinds } from "../parser/token-kind";

/**
 * Infers symbol types from an abstract syntax tree.
 *
 * The type of a symbol is taken from its first assignment,
 * later assignments do not change it.
 */
export class TypeInferer {
  public infer(ast: SourceDocumentNode): void {
    ast.walk((element) => {
      if (!(element instanceof BinaryExpressionNode)) return;
      if (!VariableAssignmentKinds.includes(element.operator.kind)) return;

      const symbol = this.findSymbol(element);
      if (symbol && symbol.type === "unknown") {
        symbol.type = this.inferSymbolType(element.rightOperand);
      }
    });
  }

  private findSymbol(node: BinaryExpressionNode): Symbol | null {
    const leftOperand = node.leftOperand;

    if (leftOperand instanceof VariableNode) {
      return leftOperand.scope.lookup(leftOperand.name.content);
    }

    if (
      leftOperand instanceof UnaryExpressionNode &&
      leftOperand.operator.kind === "DotOperator" &&
      leftOperand.operand instanceof VariableNode
    ) {
      return leftOperand.operand.scope.lookup(leftOperand.operand.name.content);
    }

    if (leftOperand instanceof StringLiteralNode) {
      const name = leftOperand.literal.content.slice(1, -1);
      return this.scopeOf(node)?.lookup(name) ?? null;
    }

    return null;
  }

  private scopeOf(node: Node): Scope | null {
    let current: Node | null = node;

    while (current) {
      if (current instanceof SourceDocumentNode) return current.scope;
      if (current instanceof TableLiteralNode) return current.members;
      if (current instanceof ForStatementNode) return current.scope;

      current = current.parent;
    }

    return null;
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
