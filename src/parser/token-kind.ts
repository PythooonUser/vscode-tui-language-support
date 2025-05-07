type TokenKindMap = { [key: string]: TokenKind };

export type TokenKind =
  | "AmpersandAmpersandOperator"
  | "BarBarOperator"
  | "ColonOperator"
  | "CommaDelimiter"
  | "Comment"
  | "DotOperator"
  | "ElseIfKeyword"
  | "ElseKeyword"
  | "EndOfFile"
  | "EqualsEqualsOperator"
  | "EqualsOperator"
  | "ExclamationEqualsOperator"
  | "ExclamationOperator"
  | "Expression"
  | "FalseKeyword"
  | "ForKeyword"
  | "FunctionKeyword"
  | "GreaterThanEqualsOperator"
  | "GreaterThanOperator"
  | "IfKeyword"
  | "LeftBraceDelimiter"
  | "LeftBracketDelimiter"
  | "LeftParenDelimiter"
  | "LessThanEqualsOperator"
  | "LessThanOperator"
  | "MinusEqualsOperator"
  | "MinusMinusOperator"
  | "MinusOperator"
  | "Name"
  | "NilKeyword"
  | "NullKeyword"
  | "NumberLiteral"
  | "PlusEqualsOperator"
  | "PlusOperator"
  | "PlusPlusOperator"
  | "QuestionOperator"
  | "ReturnKeyword"
  | "RightBraceDelimiter"
  | "RightBracketDelimiter"
  | "RightParenDelimiter"
  | "SlashEqualsOperator"
  | "SlashOperator"
  | "StarEqualsOperator"
  | "StarOperator"
  | "StringLiteral"
  | "TrueKeyword"
  | "UnknownToken"
  | "Whitespace";

export const DelimiterTokenMap: TokenKindMap = {
  ",": "CommaDelimiter",
  "(": "LeftParenDelimiter",
  ")": "RightParenDelimiter",
  "[": "LeftBracketDelimiter",
  "]": "RightBracketDelimiter",
  "{": "LeftBraceDelimiter",
  "}": "RightBraceDelimiter",
};

export const OperatorTokenMap: TokenKindMap = {
  "--": "MinusMinusOperator",
  "-": "MinusOperator",
  "-=": "MinusEqualsOperator",
  ":": "ColonOperator",
  "!": "ExclamationOperator",
  "!=": "ExclamationEqualsOperator",
  "?": "QuestionOperator",
  ".": "DotOperator",
  "*": "StarOperator",
  "*=": "StarEqualsOperator",
  "/": "SlashOperator",
  "/=": "SlashEqualsOperator",
  "&&": "AmpersandAmpersandOperator",
  "+": "PlusOperator",
  "++": "PlusPlusOperator",
  "+=": "PlusEqualsOperator",
  "<": "LessThanOperator",
  "<=": "LessThanEqualsOperator",
  "=": "EqualsOperator",
  "==": "EqualsEqualsOperator",
  ">": "GreaterThanOperator",
  ">=": "GreaterThanEqualsOperator",
  "||": "BarBarOperator",
};

export const KeywordTokenMap: TokenKindMap = {
  else: "ElseKeyword",
  elseif: "ElseIfKeyword",
  false: "FalseKeyword",
  for: "ForKeyword",
  function: "FunctionKeyword",
  if: "IfKeyword",
  nil: "NilKeyword",
  null: "NullKeyword",
  return: "ReturnKeyword",
  true: "TrueKeyword",
};

export const UnaryOperatorKinds: TokenKind[] = [
  "PlusOperator",
  "MinusOperator",
  "ExclamationOperator",
];

export const PrefixUpdateOperatorKinds: TokenKind[] = [
  "PlusPlusOperator",
  "MinusMinusOperator",
];

export const PostfixUpdateOperatorKinds: TokenKind[] = [
  "PlusPlusOperator",
  "MinusMinusOperator",
];

export const BoolLiteralKinds: TokenKind[] = ["TrueKeyword", "FalseKeyword"];

export const NullLiteralKinds: TokenKind[] = ["NullKeyword", "NilKeyword"];
