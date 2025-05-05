type TokenKindMap = { [key: string]: TokenKind };

export type TokenKind =
  | "Whitespace"
  | "UnknownToken"
  | "EndOfFile"
  | "Comment"
  | "Name"
  | "NumberLiteral"
  | "StringLiteral"
  | "CommaDelimiter"
  | "LeftParenDelimiter"
  | "RightParenDelimiter"
  | "LeftBracketDelimiter"
  | "RightBracketDelimiter"
  | "LeftBraceDelimiter"
  | "RightBraceDelimiter"
  | "MinusMinusOperator"
  | "MinusOperator"
  | "MinusEqualsOperator"
  | "ColonOperator"
  | "ExclamationOperator"
  | "ExclamationEqualsOperator"
  | "QuestionOperator"
  | "DotOperator"
  | "StarOperator"
  | "StarEqualsOperator"
  | "SlashOperator"
  | "SlashEqualsOperator"
  | "AmpersandAmpersandOperator"
  | "PlusOperator"
  | "PlusPlusOperator"
  | "PlusEqualsOperator"
  | "LessThanOperator"
  | "LessThanEqualsOperator"
  | "EqualsOperator"
  | "EqualsEqualsOperator"
  | "GreaterThanOperator"
  | "GreaterThanEqualsOperator"
  | "BarBarOperator"
  | "ElseKeyword"
  | "ElseIfKeyword"
  | "FalseKeyword"
  | "ForKeyword"
  | "FunctionKeyword"
  | "IfKeyword"
  | "NullKeyword"
  | "NilKeyword"
  | "ReturnKeyword"
  | "TrueKeyword"
  | "Expression";

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
  null: "NullKeyword",
  nil: "NilKeyword",
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
