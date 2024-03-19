export interface ASTNode {
  type: string;
  value?: any;
}

export interface BinaryExpression extends ASTNode {
  operator: string;
  left: Expression;
  right: Expression;
}

interface LiteralExpression extends ASTNode {
  value: string;
}

export type Expression = BinaryExpression | LiteralExpression;

export interface WhereClause extends ASTNode {
  condition: Expression;
}

export interface StringLiteral extends ASTNode {
  value: string;
}

interface StatementBase extends ASTNode {
  target: StringLiteral;
  from: StringLiteral;
  where?: WhereClause;
}

export interface StatementWithTo extends StatementBase {
  to: StringLiteral;
}

export interface SelectStatement extends StatementBase {}

export interface DeleteStatement extends StatementBase {}

export interface MoveStatement extends StatementWithTo {}

export interface CopyStatement extends StatementWithTo {}

export interface ArchiveStatement extends StatementWithTo {}

export interface UnarchiveStatement extends StatementWithTo {}

export type Statement =
  | SelectStatement
  | DeleteStatement
  | MoveStatement
  | CopyStatement
  | ArchiveStatement
  | UnarchiveStatement;

export interface Query extends ASTNode {
  directory: string;
  statements: Statement[];
}
