import { ASTNode } from "@sortql/core/parser/types";
import { Spec } from "@sortql/core/tokenizer/types";

const spec = new Spec([
  // SKIP: WHITE SPACE, COMMENTS
  { pattern: /^\s+/, type: null },
  { pattern: /^--.*/, type: null },

  // SEMICOLON: END OF STATEMENT
  { pattern: /^;/, type: "SEMICOLON" },

  // KEYWORDS: SELECT, DELETE, MOVE, COPY, ARCHIVE, UNARCHIVE
  { pattern: /^\bSELECT\b/, type: "SELECT" },
  { pattern: /^\bDELETE\b/, type: "DELETE" },
  { pattern: /^\bMOVE\b/, type: "MOVE" },
  { pattern: /^\bCOPY\b/, type: "COPY" },
  { pattern: /^\bARCHIVE\b/, type: "ARCHIVE" },
  { pattern: /^\bUNARCHIVE\b/, type: "UNARCHIVE" },
  { pattern: /^\bCONVERT\b/, type: "CONVERT" },

  // REQUIRED KEYWORDS: FROM, WHERE
  { pattern: /^\bFROM\b/, type: "FROM" },
  { pattern: /^\bWHERE\b/, type: "WHERE" },

  // ADDITIONAL KEYWORDS: TO
  { pattern: /^\bTO\b/, type: "TO" },

  // COMPARATIVE OPERATORS: LIKE, =, !=, <>, <=, <, >=, >
  { pattern: /^\bLIKE\b/, type: "LIKE" },
  { pattern: /^=/, type: "EQUALS" },
  { pattern: /^!=/, type: "NOT_EQUALS" },
  { pattern: /^<>/, type: "NOT_EQUALS" },
  { pattern: /^<=/, type: "LESS_THAN_OR_EQUAL" },
  { pattern: /^</, type: "LESS_THAN" },
  { pattern: /^>=/, type: "GREATER_THAN_OR_EQUAL" },
  { pattern: /^>/, type: "GREATER_THAN" },

  // LOGICAL OPERATORS: AND, OR
  { pattern: /^\bAND\b/, type: "AND" },
  { pattern: /^\bOR\b/, type: "OR" },

  // LITERALS: String
  { pattern: /'[^']*'|"[^"]*"/, type: "STRING" },
]);

export class Tokenizer {
  private _string: string;
  private _cursor: number;

  constructor() {
    this._string = "";
    this._cursor = 0;
  }

  init(string: string): void {
    this._string = string;
    this._cursor = 0;
  }

  next(): ASTNode | null {
    if (this._cursor >= this._string.length) {
      return null;
    }

    const string = this._string.slice(this._cursor);

    for (const { pattern, type } of spec) {
      const match = pattern.exec(string);

      if (match) {
        this._cursor += match[0].length;

        // Skip token if type is null
        if (type === null) {
          return this.next();
        }

        return {
          type,
          value: match[0],
        };
      }
    }

    throw new SyntaxError(
      `Unexpected token at position ${this._cursor}: "${string}"`
    );
  }
}
