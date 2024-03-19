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

    return this.parseQuery();
  }

  private parseQuery(): Query {
    const query: Query = {
      type: "Query",
      directory: this._directory,
      statements: [],
    };

    while (this._lookahead) {
      switch (this._lookahead.type) {
        case "SELECT":
          query.statements.push(this.parseSelectStatement());
          break;
        case "DELETE":
          query.statements.push(this.parseDeleteStatement());
          break;
        case "MOVE":
          query.statements.push(this.parseMoveStatement());
          break;
        case "COPY":
          query.statements.push(this.parseCopyStatement());
          break;
        case "ARCHIVE":
          query.statements.push(this.parseArchiveStatement());
          break;
        case "UNARCHIVE":
          query.statements.push(this.parseUnarchiveStatement());
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

  private parseSelectStatement(): SelectStatement {
    this.consume("SELECT");

    return {
      type: "SelectStatement",
      target: this.parseStringLiteral(),
      from: this.parseFromClause(),
      where: this.parseWhereClause(),
    };
  }

  private parseDeleteStatement(): DeleteStatement {
    this.consume("DELETE");

    return {
      type: "DeleteStatement",
      target: this.parseStringLiteral(),
      from: this.parseFromClause(),
      where: this.parseWhereClause(),
    };
  }

  private parseMoveStatement(): MoveStatement {
    this.consume("MOVE");

    return {
      type: "MoveStatement",
      target: this.parseStringLiteral(),
      from: this.parseFromClause(),
      where: this.parseWhereClause(),
      to: this.parseToClause(),
    };
  }

  private parseCopyStatement(): CopyStatement {
    this.consume("COPY");

    return {
      type: "CopyStatement",
      target: this.parseStringLiteral(),
      from: this.parseFromClause(),
      where: this.parseWhereClause(),
      to: this.parseToClause(),
    };
  }

  private parseArchiveStatement(): ArchiveStatement {
    this.consume("ARCHIVE");

    return {
      type: "ArchiveStatement",
      target: this.parseStringLiteral(),
      from: this.parseFromClause(),
      where: this.parseWhereClause(),
      to: this.parseToClause(),
    };
  }

  private parseUnarchiveStatement(): UnarchiveStatement {
    this.consume("UNARCHIVE");

    return {
      type: "UnarchiveStatement",
      target: this.parseStringLiteral(),
      from: this.parseFromClause(),
      where: this.parseWhereClause(),
      to: this.parseToClause(),
    };
  }

  private parseFromClause(): StringLiteral {
    this.consume("FROM");

    return this.parseStringLiteral();
  }

  private parseToClause(): StringLiteral {
    this.consume("TO");

    return this.parseStringLiteral();
  }

  private parseWhereClause(): WhereClause | undefined {
    if (this._lookahead?.type !== "WHERE") {
      return undefined;
    }

    this.consume("WHERE");

    return { type: "WhereClause", condition: this.parseExpression() };
  }

  private parseExpression(): Expression {
    let left = this.parseComparisonExpression();

    while (this._lookahead && ["AND", "OR"].includes(this._lookahead.type)) {
      const operator = this.consume(this._lookahead.type).type;
      const right = this.parseComparisonExpression();
      left = { type: "BinaryExpression", operator, left, right };
    }

    return left;
  }

  private parseComparisonExpression(): BinaryExpression {
    const left = this.parseStringLiteral();
    const operator = this.consume([
      "LIKE",
      "EQUALS",
      "NOT_EQUALS",
      "GREATER_THAN",
      "LESS_THAN",
      "GREATER_THAN_OR_EQUAL",
      "LESS_THAN_OR_EQUAL",
    ]).type;
    const right = this.parseStringLiteral();

    return { type: "BinaryExpression", operator, left, right };
  }

  private parseStringLiteral(): StringLiteral {
    const token = this.consume("STRING");

    return { type: "StringLiteral", value: token.value.slice(1, -1) };
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
}
