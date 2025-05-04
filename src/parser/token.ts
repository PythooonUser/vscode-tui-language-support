import { TokenError } from "./token-error";
import { TokenKind } from "./token-kind";

export class Token {
  constructor(
    public start: number,
    public length: number,
    public kind: TokenKind,
    public trivia: Token[],
    public error: TokenError | null
  ) {}
}
