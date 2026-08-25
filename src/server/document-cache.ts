import {
  ArgumentExpressionNode,
  CallExpressionNode,
  ExpressionStatementNode,
  Parser,
  SourceDocumentNode,
  StringLiteralNode,
  VariableNode,
} from "../parser";

export class DocumentCache {
  private documents: Record<string, Document> = {};
  private imports: Record<string, string[]> = {};

  public update(uri: string, content: string) {
    this.documents[uri] = new Document(content);
    this.updateImports(uri, this.documents[uri].ast);
  }

  public get(uri: string) {
    if (!(uri in this.documents)) return null;

    return this.documents[uri];
  }

  private updateImports(uri: string, ast: SourceDocumentNode) {
    const imports: string[] = [];

    for (const node of ast.statements) {
      if (
        node.kind === "ExpressionStatementNode" &&
        (node as ExpressionStatementNode).expression.kind ===
          "CallExpressionNode" &&
        ((node as ExpressionStatementNode).expression as CallExpressionNode)
          .expression.kind === "VariableNode" &&
        (
          ((node as ExpressionStatementNode).expression as CallExpressionNode)
            .expression as VariableNode
        ).name.content === "require"
      ) {
        const args = (
          (node as ExpressionStatementNode).expression as CallExpressionNode
        ).arguments.elements;
        if (
          args.length === 1 &&
          args[0].kind === "ArgumentExpressionNode" &&
          (args[0] as ArgumentExpressionNode).argument.kind ===
            "StringLiteralNode"
        ) {
          imports.push(
            ((args[0] as ArgumentExpressionNode).argument as StringLiteralNode)
              .literal.content,
          );
        }
      }
    }

    this.imports[uri] = imports;
  }
}

export class Document {
  public ast!: SourceDocumentNode;

  constructor(content: string) {
    const parser = new Parser();
    this.ast = parser.parseSourceDocument(content);
  }
}
