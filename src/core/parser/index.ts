import { Tokenizer } from "@sortql/core/tokenizer";
import {
  ASTNode,
  ArchiveStatement,
  BinaryExpression,
  CopyStatement,
  DeleteStatement,
  Expression,
  MoveStatement,
  Query,
  SelectStatement,
  StringLiteral,
  UnarchiveStatement,
  WhereClause,
} from "@sortql/core/parser/types";

export class Parser {
  private _directory: string;
  private _tokenizer: Tokenizer;
  private _lookahead: ASTNode | null;

  constructor(directory: string) {
    this._directory = directory;
    this._tokenizer = new Tokenizer();
    this._lookahead = null;
  }

  parse(string: string): Query {
    this._tokenizer.init(string);
    this._lookahead = this._tokenizer.next();

    return this.Query();
  }

  private consume(expectedTypes: string | string[]): ASTNode {
    if (!Array.isArray(expectedTypes)) {
      expectedTypes = [expectedTypes];
    }

    const token = this._lookahead;

    if (!token || !expectedTypes.includes(token.type)) {
      throw new SyntaxError(`Unexpected token '${token?.value}'`);
    }

    this._lookahead = this._tokenizer.next();

    return token;
  }

  private Query(): Query {
    const query: Query = {
      type: "Query",
      directory: this._directory,
      statements: [],
    };

    while (this._lookahead) {
      switch (this._lookahead.type) {
        case "SELECT":
          query.statements.push(this.SelectStatement());
          break;
        case "DELETE":
          query.statements.push(this.DeleteStatement());
          break;
        case "MOVE":
          query.statements.push(this.MoveStatement());
          break;
        case "COPY":
          query.statements.push(this.CopyStatement());
          break;
        case "ARCHIVE":
          query.statements.push(this.ArchiveStatement());
          break;
        case "UNARCHIVE":
          query.statements.push(this.UnarchiveStatement());
          break;
        case "SEMICOLON":
          this.consume("SEMICOLON");
          break;
        default:
          throw new SyntaxError(`Unexpected token '${this._lookahead.value}'`);
      }
    }

    return query;
  }

  private SelectStatement(): SelectStatement {
    this.consume("SELECT");

    return {
      type: "SelectStatement",
      target: this.StringLiteral(),
      from: this.FromClause(),
      where: this.WhereClause(),
    };
  }

  private DeleteStatement(): DeleteStatement {
    this.consume("DELETE");

    return {
      type: "DeleteStatement",
      target: this.StringLiteral(),
      from: this.FromClause(),
      where: this.WhereClause(),
    };
  }

  private MoveStatement(): MoveStatement {
    this.consume("MOVE");

    return {
      type: "MoveStatement",
      target: this.StringLiteral(),
      from: this.FromClause(),
      where: this.WhereClause(),
      to: this.ToClause(),
    };
  }

  private CopyStatement(): CopyStatement {
    this.consume("COPY");

    return {
      type: "CopyStatement",
      target: this.StringLiteral(),
      from: this.FromClause(),
      where: this.WhereClause(),
      to: this.ToClause(),
    };
  }

  private ArchiveStatement(): ArchiveStatement {
    this.consume("ARCHIVE");

    return {
      type: "ArchiveStatement",
      target: this.StringLiteral(),
      from: this.FromClause(),
      where: this.WhereClause(),
      to: this.ToClause(),
    };
  }

  private UnarchiveStatement(): UnarchiveStatement {
    this.consume("UNARCHIVE");

    return {
      type: "UnarchiveStatement",
      target: this.StringLiteral(),
      from: this.FromClause(),
      where: this.WhereClause(),
      to: this.ToClause(),
    };
  }

  private FromClause(): StringLiteral {
    this.consume("FROM");

    return this.StringLiteral();
  }

  private ToClause(): StringLiteral {
    this.consume("TO");

    return this.StringLiteral();
  }

  private WhereClause(): WhereClause | undefined {
    if (this._lookahead?.type !== "WHERE") {
      return undefined;
    }

    this.consume("WHERE");

    return { type: "WhereClause", condition: this.Expression() };
  }

  private Expression(): Expression {
    let left = this.ComparisonExpression();

    while (this._lookahead && ["AND", "OR"].includes(this._lookahead.type)) {
      const operator = this.consume(this._lookahead.type).type;
      const right = this.ComparisonExpression();

      left = { type: "BinaryExpression", operator, left, right };
    }

    return left;
  }

  private ComparisonExpression(): BinaryExpression {
    const left = this.StringLiteral();

    const operator = this.consume([
      "LIKE",
      "EQUALS",
      "NOT_EQUALS",
      "GREATER_THAN",
      "LESS_THAN",
      "GREATER_THAN_OR_EQUAL",
      "LESS_THAN_OR_EQUAL",
    ]).type;

    const right = this.StringLiteral();

    return { type: "BinaryExpression", operator, left, right };
  }

  private StringLiteral(): StringLiteral {
    const token = this.consume("STRING");

    return { type: "StringLiteral", value: token.value.slice(1, -1) };
  }
}
