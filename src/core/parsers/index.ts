import chalk from "chalk";

import {
  Condition,
  Property,
  Literal,
  LogicalCondition,
  LogicalOperator,
} from "@sortql/core/filter";

import { Query } from "@sortql/core/queries";
import { ArchiveQuery } from "@sortql/core/queries/archive";
import { CopyQuery } from "@sortql/core/queries/copy";
import { MoveQuery } from "@sortql/core/queries/move";
import { SelectQuery } from "@sortql/core/queries/select";
import { DeleteQuery } from "@sortql/core/queries/delete";
import { UnarchiveQuery } from "@sortql/core/queries/unarchive";

export interface IParser<T> {
  parse(tokens: string[]): T | null;
}

export type Target = "files" | "folders";

export class QueryParser implements IParser<Query> {
  directory: string;
  whereParser: WhereParser;

  constructor(directory: string) {
    this.directory = directory;
    this.whereParser = new WhereParser();
  }

  parse(tokens: string[]): Query | null {
    if (tokens.length < 2) return null;

    const operation = tokens[0].toUpperCase();
    const target = tokens[1].toLowerCase() as Target;
    const fromIndex = tokens.indexOf("FROM");
    const toIndex = tokens.indexOf("TO");
    const from = tokens[fromIndex + 1];
    const whereTokens =
      toIndex > fromIndex
        ? tokens.slice(fromIndex + 2, toIndex)
        : tokens.slice(fromIndex + 2);
    const where = this.whereParser.parse(whereTokens);

    try {
      switch (operation) {
        case "SELECT":
          return new SelectQuery(this.directory, target, from, where);
        case "DELETE":
          return new DeleteQuery(this.directory, target, from, where);
        case "MOVE":
          const moveTo = tokens[toIndex + 1];
          return new MoveQuery(this.directory, target, from, moveTo, where);
        case "COPY":
          const copyTo = tokens[toIndex + 1];
          return new CopyQuery(this.directory, target, from, copyTo, where);
        case "ARCHIVE":
          const archiveTo = tokens[toIndex + 1];
          return new ArchiveQuery(
            this.directory,
            target,
            from,
            archiveTo,
            where
          );
        case "UNARCHIVE":
          const unarchiveTo = tokens[toIndex + 1];
          return new UnarchiveQuery(
            this.directory,
            target,
            from,
            unarchiveTo,
            where
          );
        default:
          return null;
      }
    } catch (e: any) {
      console.log(chalk.red(`${e.message}. Skipping query...`));
      return null;
    }
  }
}

export class WhereParser {
  parse(tokens: string[]): LogicalCondition | undefined {
    if (tokens[0] === "WHERE") {
      tokens.shift();
    }

    let conditions: Condition[] = [];
    let operators: LogicalOperator[] = [];

    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i] === "AND" || tokens[i] === "OR") {
        operators.push(tokens[i] as LogicalOperator);
        continue;
      }

      if (
        i + 2 >= tokens.length ||
        tokens[i + 1] === "AND" ||
        tokens[i + 1] === "OR"
      ) {
        console.error("Incomplete condition found.");
        return undefined;
      }

      const property = new Property(tokens[i]);
      const operator = tokens[i + 1];
      const value = new Literal(tokens[i + 2]);

      conditions.push(new Condition(property, operator, value));
      i += 2;
    }

    if (operators.length === 0) {
      return new LogicalCondition(conditions);
    }

    if (new Set(operators).size > 1) {
      console.error(
        "Mixed AND/OR operators are not supported in the current implementation."
      );
      return undefined;
    }

    return new LogicalCondition(conditions, operators[0]);
  }
}
