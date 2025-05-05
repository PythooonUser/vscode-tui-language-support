# tui Grammar

## Usage of the grammar

- the grammar lists productions for a tui program
- a non-terminal is written in `lowercase`
- a terminal is written in `UPPERCASE`
- individual tokens are `"quoted"`
- pipe `|` means boolean or
- question `?` means zero or one
- star `*` means zero or more
- plus `+` means one or more
- parens `()` mean a group

## Grammar for tui

```
program
  object_literal? EOF
```

### Statements

```
statement
  variable_declaration | if_statement | for_statement | return_statement | expression_statement
```

```
variable_declaration
  IDENTIFIER "=" expression ( "," | NEW_LINE )
```

```
block
  "{" statement* "}"
```

```
expression_statement
  expression ( "," | NEW_LINE )
```

```
if_statement
  "if" expression block elseif_statement* else_statement?
```

```
elseif_statement
  ( "elseif" | "else" "if" ) block
```

```
else_statement
  "else" block
```

```
return_statement
  "return" expression? ( "," | NEW_LINE )
```

```
for_statement
  "for" argument_list block
```

### Expressions

```
expression
  literal_expression | unary_expression | binary_expression | ternary_expression | group_expression | function_declaration
```

```
literal_expression
  IDENTIFIER | object_literal | STRING | NUMBER | BOOL | NULL
```

```
unary_expression
  unary_prefix_expression | unary_postfix_expression
```

```
unary_prefix_expression
  ( "!" | "-" ) expression
```

```
unary_postfix_expression
  object_access_expression | member_access_expression | call_expression
```

```
object_access_expression
  expression "[" expression "]"
```

```
member_access_expression
  expression "." expression
```

```
call_expression
  expression argument_list
```

```
argument_list
  "(" argument* ( "," argument )* ")"
```

```
argument
  expression
```

```
binary_expression
  expression operator expression
```

```
group_expression
  "(" expression? ")"
```

```
function_declaration
  "function" parameter_list block
```

```
parameter_list
  "(" parameter* ( "," parameter )* ")"
```

```
parameter
  IDENTIFIER
```

```
operator
  "++" | "--" | "&&" | "||" | "<=" | ">=" | "<" | ">" | "!=" | "==" | "!" | "/=" | "*=" | "+=" | "-=" | "+" | "-" | "/" | "*" | "=" | ":" | "?" | "."
```

### Literals

```
IDENTIFIER
  "a-zA-Z_" "a-zA-Z_0-9"*
```

```
STRING
  """ ANY_EXCEPT_" """ | "'" ANY_EXCEPT_' "'"
```

```
NUMBER
  "0123456789"* ( "." "0123456789"+ )?
```

```
BOOL
  "true" | "false"
```

```
NULL
  "null" | "nil"
```

```
object_literal
  ( "[" | "{" )? statement* ( "]" | "}" )?
```
