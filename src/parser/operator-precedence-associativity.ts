import { Associativity } from "./associativity";

export type PrecedenceAndAssociativity = {
  precedence: number;
  associativity: Associativity;
};

export type PrecedenceAndAssociativityMap = {
  [key: string]: PrecedenceAndAssociativity;
};

export const InvalidOperatorPrecedenceAndAssociativity: PrecedenceAndAssociativity =
  {
    precedence: -1,
    associativity: "None",
  };

export const OperatorPrecedenceAndAssociativityMap: PrecedenceAndAssociativityMap =
  {
    // Assignment Expression
    ["EqualsOperator"]: {
      precedence: 1,
      associativity: "Right",
    },
    ["PlusEqualsOperator"]: {
      precedence: 1,
      associativity: "Right",
    },
    ["MinusEqualsOperator"]: {
      precedence: 1,
      associativity: "Right",
    },
    ["StarEqualsOperator"]: {
      precedence: 1,
      associativity: "Right",
    },
    ["SlashEqualsOperator"]: {
      precedence: 1,
      associativity: "Right",
    },

    // Conditional Expression
    ["QuestionOperator"]: {
      precedence: 2,
      associativity: "Left",
    },

    // Logical Expression
    ["BarBarOperator"]: {
      precedence: 3,
      associativity: "Left",
    },
    ["AmpersandAmpersandOperator"]: {
      precedence: 4,
      associativity: "Left",
    },

    // Equality Expression
    ["EqualsEqualsOperator"]: {
      precedence: 5,
      associativity: "None",
    },
    ["ExclamationEqualsOperator"]: {
      precedence: 5,
      associativity: "None",
    },

    // Relational Expression
    ["LessThanEqualsOperator"]: {
      precedence: 6,
      associativity: "None",
    },
    ["GreaterThanEqualsOperator"]: {
      precedence: 6,
      associativity: "None",
    },
    ["LessThanOperator"]: {
      precedence: 6,
      associativity: "None",
    },
    ["GreaterThanOperator"]: {
      precedence: 6,
      associativity: "None",
    },

    // Additive Expression
    ["PlusOperator"]: {
      precedence: 7,
      associativity: "Left",
    },
    ["MinusOperator"]: {
      precedence: 7,
      associativity: "Left",
    },

    // Multiplicative Expression
    ["StarOperator"]: {
      precedence: 8,
      associativity: "Left",
    },
    ["SlashOperator"]: {
      precedence: 8,
      associativity: "Left",
    },
  };
