import { Lexer } from "./lexer";
import {
  SourceDocumentNode,
  Node,
  ReturnStatementNode,
  ExpressionStatementNode,
  MissingDeclarationNode,
  BinaryExpressionNode,
  UnaryExpressionNode,
  PrefixUpdateExpressionNode,
  PostfixUpdateExpressionNode,
  StringLiteralNode,
  NumberLiteralNode,
  VariableNode,
  BoolLiteralNode,
  NullLiteralNode,
  ParenthesizedExpressionNode,
  TableLiteralNode,
  CallExpressionNode,
  ArgumentExpressionListNode,
  ArgumentExpressionNode,
  IfStatementNode,
  ElseClauseNode,
  CompoundStatementNode,
} from "./nodes";
import {
  InvalidOperatorPrecedenceAndAssociativity,
  OperatorPrecedenceAndAssociativityMap,
} from "./operator-precedence-associativity";
import { ParseContext } from "./parse-context";
import { ParseContextError } from "./parse-context-error";
import { Token } from "./token";
import {
  BoolLiteralKinds,
  NullLiteralKinds,
  PostfixUpdateOperatorKinds,
  PrefixUpdateOperatorKinds,
  TokenKind,
  UnaryOperatorKinds,
} from "./token-kind";
import { NodeOrTokenArray, OptionalToken } from "./types";

export class Parser {
  private lexer: Lexer;
  private token: OptionalToken;
  private parseContexts: ParseContext[];

  constructor() {
    this.lexer = new Lexer();
    this.token = null;
    this.parseContexts = [];
  }

  /**
   * Parses a source document and returns a source document node.
   *
   * @param document The source document.
   * @returns The root node for the AST.
   */
  parseSourceDocument(document: string): SourceDocumentNode {
    this.reset(document);
    this.advance();

    const node = new SourceDocumentNode();
    node.statements = this.parseElementList(node, "SourceElements");
    node.endOfFile = this.consume(node, "EndOfFile");
    node.document = document;

    this.advance();

    return node;
  }

  private reset(document: string): void {
    this.lexer.reset(document);
    this.token = null;
    this.parseContexts = [];
  }

  private advance(): void {
    this.token = this.lexer.advance();
  }

  private consume(parent: Node, kind: TokenKind): Token {
    const token = this.token;

    if (token?.kind === kind) {
      this.token = this.lexer.advance();
      token.parent = parent;

      return token;
    }

    const missingToken = new Token(
      token?.start ?? 0,
      0,
      kind,
      [],
      "MissingToken"
    );
    missingToken.parent = parent;

    return missingToken;
  }

  private consumeOptional(parent: Node, kind: TokenKind): OptionalToken {
    const token = this.token;

    if (token?.kind === kind) {
      this.token = this.lexer.advance();
      token.parent = parent;

      return token;
    }

    return null;
  }

  private consumeChoice(parent: Node, kinds: TokenKind[]): Token {
    const token = this.token;

    if (token && kinds.includes(token.kind)) {
      this.token = this.lexer.advance();
      token.parent = parent;

      return token;
    }

    const missingToken = new Token(
      token?.start ?? 0,
      0,
      kinds[0],
      [],
      "MissingToken"
    );
    missingToken.parent = parent;

    return missingToken;
  }

  private getOperatorPrecedenceAndAssociativity(kind: TokenKind | null) {
    if (!kind) {
      return InvalidOperatorPrecedenceAndAssociativity;
    }

    const precedenceAndAssociativity =
      OperatorPrecedenceAndAssociativityMap[kind];

    if (!precedenceAndAssociativity) {
      return InvalidOperatorPrecedenceAndAssociativity;
    }

    return precedenceAndAssociativity;
  }

  private getParseContextHistory(): ParseContext[] {
    return (["SourceElements"] as ParseContext[]).concat(
      this.parseContexts.slice(0, -1)
    );
  }

  private setCurrentParseContext(context: ParseContext): void {
    this.parseContexts.push(context);
  }

  private restorePreviousParseContext(): void {
    this.parseContexts.pop();
  }

  private parseElementList(
    parent: Node,
    context: ParseContext
  ): NodeOrTokenArray {
    this.setCurrentParseContext(context);

    const elementList: NodeOrTokenArray = [];

    while (this.token && !this.isElementListTerminator(context, this.token)) {
      if (this.isElementListInitiator(context, this.token)) {
        const parser = this.getElementListParser(context);
        const element = parser(parent);
        elementList.push(element);
        continue;
      }

      if (this.isValidInEnclosingContexts(this.token)) {
        break;
      }

      const skippedToken = this.token;
      skippedToken.error = "SkippedToken";
      elementList.push(skippedToken);
      this.advance();
    }

    this.restorePreviousParseContext();

    return elementList;
  }

  private isValidInEnclosingContexts(token: Token): boolean {
    const parseContextHistory = this.getParseContextHistory();

    for (let i = parseContextHistory.length - 1; i >= 0; i--) {
      const context = parseContextHistory[i];

      if (
        this.isElementListInitiator(context, token) ||
        this.isElementListTerminator(context, token)
      ) {
        return true;
      }
    }

    return false;
  }

  private isElementListTerminator(
    context: ParseContext,
    token: Token
  ): boolean {
    const kind = token.kind;

    if (kind === "EndOfFile") {
      return true;
    }

    switch (context) {
      case "SourceElements":
        return false;
      case "TableLiteralElements":
        return (
          kind === "RightBracketDelimiter" || kind === "RightBraceDelimiter"
        );
      case "ArgumentExpressionListElement":
        return kind === "RightParenDelimiter";
      case "BlockStatements":
        return kind === "RightBraceDelimiter";
      default:
        throw new ParseContextError(`Unknown parse context '${context}'`);
    }
  }

  private isElementListInitiator(context: ParseContext, token: Token): boolean {
    switch (context) {
      case "SourceElements":
      case "TableLiteralElements":
      case "BlockStatements":
        return this.isStatementInitiator(token);
      case "ArgumentExpressionListElement":
        return this.isExpressionInitiator(token);
      default:
        throw new ParseContextError(`Unknown parse context '${context}'`);
    }
  }

  private isStatementInitiator(token: Token): boolean {
    switch (token.kind) {
      case "FunctionKeyword":
      case "IfKeyword":
      case "ElseKeyword":
      case "ElseIfKeyword":
      case "ForKeyword":
      case "ReturnKeyword":
        return true;
      default:
        return this.isExpressionInitiator(token);
    }
  }

  private isExpressionInitiator(token: Token): boolean {
    switch (token.kind) {
      case "Name":
      case "NumberLiteral":
      case "StringLiteral":
      case "PlusOperator":
      case "PlusPlusOperator":
      case "MinusMinusOperator":
      case "LeftParenDelimiter":
      case "LeftBracketDelimiter":
      case "LeftBraceDelimiter":
      case "ExclamationOperator":
      case "TrueKeyword":
      case "FalseKeyword":
      case "NullKeyword":
      case "NilKeyword":
        return true;
      default:
        return false;
    }
  }

  private getElementListParser(context: ParseContext) {
    switch (context) {
      case "SourceElements":
      case "TableLiteralElements":
      case "BlockStatements":
        return this.parseStatement.bind(this);
      case "ArgumentExpressionListElement":
        return this.parseArgumentExpressionList.bind(this);
      default:
        throw new ParseContextError(`Unknown parse context '${context}'`);
    }
  }

  private parseStatement(parent: Node) {
    const kind = this.token?.kind;

    switch (kind) {
      case "ReturnKeyword":
        return this.parseReturnStatement(parent);
      case "IfKeyword":
        return this.parseIfStatement(parent);
      default:
        return this.parseExpressionStatement(parent);
    }
  }

  private parseReturnStatement(parent: Node): ReturnStatementNode {
    const node = new ReturnStatementNode();
    node.parent = parent;

    node.returnKeyword = this.consume(node, "ReturnKeyword");
    if (this.token && this.isExpressionInitiator(this.token)) {
      node.expression = this.parseExpression(node);
    }
    // TODO: Add NEW_LINE
    node.delimiter = this.consume(node, "CommaDelimiter");

    return node;
  }

  private parseIfStatement(parent: Node): IfStatementNode {
    const node = new IfStatementNode();
    node.parent = parent;

    node.ifKeyword = this.consume(node, "IfKeyword");
    node.condition = this.parseExpression(node);
    node.statements = this.parseCompoundStatement(node);

    const token = this.token;
    if (token?.kind === "ElseKeyword") {
      node.elseClause = this.parseElseClause(node);
    }

    return node;
  }

  private parseElseClause(parent: Node): ElseClauseNode {
    const node = new ElseClauseNode();
    node.parent = parent;

    node.elseKeyword = this.consume(node, "ElseKeyword");
    node.statements = this.parseCompoundStatement(node);

    return node;
  }

  private parseCompoundStatement(parent: Node): CompoundStatementNode {
    const node = new CompoundStatementNode();
    node.parent = parent;

    node.leftBrace = this.consume(node, "LeftBraceDelimiter");
    node.statements = this.parseElementList(node, "BlockStatements");
    node.rightBrace = this.consume(node, "RightBraceDelimiter");

    return node;
  }

  private parseExpressionStatement(parent: Node): ExpressionStatementNode {
    const node = new ExpressionStatementNode();
    node.parent = parent;

    node.expression = this.parseExpression(node);
    node.delimiter = this.consume(node, "CommaDelimiter");

    return node;
  }

  private parseExpression(parent: Node) {
    const token = this.token;

    if (token?.kind === "EndOfFile") {
      const node = new MissingDeclarationNode();
      node.parent = parent;
      node.declaration = new Token(
        token.start,
        0,
        "Expression",
        [],
        "MissingToken"
      );

      return node;
    }

    return this.parseBinaryExpressionOrHigher(0, parent);
  }

  private parsePrimaryExpression(parent: Node) {
    const token = this.token;

    switch (token?.kind) {
      case "Name":
        return this.parseVariable(parent);

      case "TrueKeyword":
      case "FalseKeyword":
        return this.parseBoolLiteral(parent);

      case "NullKeyword":
      case "NilKeyword":
        return this.parseNullLiteral(parent);

      case "NumberLiteral":
        return this.parseNumberLiteral(parent);

      case "StringLiteral":
        return this.parseStringLiteral(parent);

      case "LeftBracketDelimiter":
      case "LeftBraceDelimiter":
        return this.parseTableLiteral(parent);

      case "LeftParenDelimiter":
        return this.parseParenthesizedExpression(parent);

      default:
        const node = new MissingDeclarationNode();
        node.parent = parent;
        node.declaration = new Token(
          token?.start ?? 0,
          0,
          "Expression",
          [],
          "MissingToken"
        );

        return node;
    }
  }

  private parseBinaryExpressionOrHigher(precedence: number, parent: Node) {
    let leftOperand = this.parseUnaryExpressionOrHigher(parent);

    while (true) {
      let token = this.token;
      const precedenceAndAssociativity =
        this.getOperatorPrecedenceAndAssociativity(token?.kind ?? null);

      const validPrecedence =
        precedenceAndAssociativity.associativity === "Right"
          ? precedenceAndAssociativity.precedence >= precedence
          : precedenceAndAssociativity.precedence > precedence;

      if (!validPrecedence) {
        break;
      }

      // At this point `token` is definetly defined as we made the precedence and associativity check above.
      token = token as Token;

      this.advance();

      leftOperand = this.parseBinaryExpression(
        leftOperand,
        token,
        this.parseBinaryExpressionOrHigher(
          precedenceAndAssociativity.precedence,
          parent
        ),
        parent
      );
    }

    return leftOperand;
  }

  private parseBinaryExpression(
    leftOperand: Node,
    operator: Token,
    rightOperand: Node,
    parent: Node
  ): BinaryExpressionNode {
    const node = new BinaryExpressionNode();
    node.parent = parent;

    leftOperand.parent = node;
    operator.parent = node;
    rightOperand.parent = node;

    node.leftOperand = leftOperand;
    node.operator = operator;
    node.rightOperand = rightOperand;

    return node;
  }

  private parseUnaryExpression(parent: Node | null): UnaryExpressionNode {
    const node = new UnaryExpressionNode();
    node.parent = parent;

    node.operator = this.consumeChoice(node, UnaryOperatorKinds);
    node.operand = this.parseUnaryExpressionOrHigher(node);

    return node;
  }

  private parseUnaryExpressionOrHigher(parent: Node) {
    const token = this.token;

    switch (token?.kind) {
      case "PlusOperator":
      case "MinusOperator":
      case "ExclamationOperator":
        return this.parseUnaryExpression(parent);
      case "PlusPlusOperator":
      case "MinusMinusOperator":
        return this.parsePrefixUpdateExpression(parent);
      default:
        const expression = this.parsePrimaryExpression(parent);
        return this.parsePostfixExpression(expression);
    }
  }

  private parsePrefixUpdateExpression(
    parent: Node | null
  ): PrefixUpdateExpressionNode {
    const node = new PrefixUpdateExpressionNode();
    node.parent = parent;

    node.operator = this.consumeChoice(node, PrefixUpdateOperatorKinds);
    node.operand = this.parsePrimaryExpression(node);

    return node;
  }

  private parsePostfixExpression(expression: Node): Node {
    const token = this.token;

    switch (token?.kind) {
      case "PlusPlusOperator":
      case "MinusMinusOperator":
        return this.parsePostfixUpdateExpression(expression);
      case "LeftParenDelimiter":
        const callExpression = this.parseCallExpression(expression);
        return this.parsePostfixExpression(callExpression);
      default:
        return expression;
    }
  }

  private parsePostfixUpdateExpression(
    expression: Node
  ): PostfixUpdateExpressionNode {
    const node = new PostfixUpdateExpressionNode();
    node.parent = expression.parent;
    expression.parent = node;

    node.operand = expression;
    node.operator = this.consumeChoice(node, PostfixUpdateOperatorKinds);

    return node;
  }

  private parseStringLiteral(parent: Node): StringLiteralNode {
    const node = new StringLiteralNode();
    node.parent = parent;

    node.literal = this.consume(node, "StringLiteral");

    return node;
  }

  private parseNumberLiteral(parent: Node): NumberLiteralNode {
    const node = new NumberLiteralNode();
    node.parent = parent;

    node.literal = this.consume(node, "NumberLiteral");

    return node;
  }

  private parseVariable(parent: Node): VariableNode {
    const node = new VariableNode();
    node.parent = parent;

    node.name = this.consume(node, "Name");

    return node;
  }

  private parseBoolLiteral(parent: Node): BoolLiteralNode {
    const node = new BoolLiteralNode();
    node.parent = parent;

    node.literal = this.consumeChoice(node, BoolLiteralKinds);

    return node;
  }

  private parseNullLiteral(parent: Node): NullLiteralNode {
    const node = new NullLiteralNode();
    node.parent = parent;

    node.literal = this.consumeChoice(node, NullLiteralKinds);

    return node;
  }

  private parseParenthesizedExpression(
    parent: Node
  ): ParenthesizedExpressionNode {
    const node = new ParenthesizedExpressionNode();
    node.parent = parent;

    node.leftParen = this.consume(node, "LeftParenDelimiter");
    node.expression = this.parseExpression(node);
    node.rightParen = this.consume(node, "RightParenDelimiter");

    return node;
  }

  private parseTableLiteral(parent: Node): TableLiteralNode {
    const node = new TableLiteralNode();
    node.parent = parent;

    node.leftDelimiter = this.consumeChoice(node, [
      "LeftBracketDelimiter",
      "LeftBraceDelimiter",
    ]);
    node.elements = this.parseElementList(node, "TableLiteralElements");
    node.rightDelimiter = this.consumeChoice(node, [
      "RightBracketDelimiter",
      "RightBraceDelimiter",
    ]);

    return node;
  }

  private parseCallExpression(expression: Node): CallExpressionNode {
    const node = new CallExpressionNode();
    node.parent = expression.parent;
    expression.parent = node;

    node.expression = expression;
    node.arguments = this.parseArgumentExpressionList(node);

    return node;
  }

  private parseArgumentExpressionList(
    parent: Node
  ): ArgumentExpressionListNode {
    const node = new ArgumentExpressionListNode();
    node.parent = parent;

    node.leftParen = this.consume(node, "LeftParenDelimiter");
    node.elements = this.parseElementList(
      node,
      "ArgumentExpressionListElement"
    );
    node.rightParen = this.consume(node, "RightParenDelimiter");

    return node;
  }

  private parseArgumentExpressionListElement(
    parent: Node
  ): Token | ArgumentExpressionNode {
    if (this.token?.kind === "CommaDelimiter") {
      return this.consume(parent, "CommaDelimiter");
    }

    return this.parseArgumentExpression(parent);
  }

  private parseArgumentExpression(parent: Node): ArgumentExpressionNode {
    const node = new ArgumentExpressionNode();
    node.parent = parent;

    node.argument = this.parseExpression(node);

    return node;
  }
}
