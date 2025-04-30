// @ts-check

class TokenError {}

TokenError.UnexpectedEndOfFile = "TokenError.UnexpectedEndOfFile";
TokenError.UnknownToken = "TokenError.UnknownToken";
TokenError.MissingToken = "TokenError.MissingToken";
TokenError.SkippedToken = "TokenError.SkippedToken";

exports.TokenError = TokenError;
