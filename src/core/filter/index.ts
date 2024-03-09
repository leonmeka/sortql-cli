import path from "path";
import { stat, readdir } from "fs/promises";
import { existsSync, Stats } from "fs";

import { Query } from "@sortql/core/queries";

export class Property {
  constructor(public name: string) {}
}

export class Literal {
  constructor(public value: string) {}
}

export class Condition {
  constructor(
    public property: Property,
    public operator: string,
    public literal: Literal
  ) {}
}

export type LogicalOperator = "AND" | "OR";

export class LogicalCondition {
  constructor(
    public conditions: Condition[],
    public operator?: LogicalOperator
  ) {}
}

export class Filter {
  constructor(public directory: string) {}

  async isMatch(
    entry: string,
    logicalCondition?: LogicalCondition
  ): Promise<boolean> {
    if (!logicalCondition || logicalCondition.conditions.length === 0)
      return true;

    const stats = await stat(entry);
    const results = [];

    for (const condition of logicalCondition.conditions) {
      const { operator, property, literal } = condition;

      const value = this.getPropertyValue(entry, property.name, stats);
      const match = this.compareValues(value, literal.value, operator);
      results.push(match);
    }

    if (logicalCondition.operator === "OR") {
      return results.some((result) => result);
    }

    if (logicalCondition.operator === "AND") {
      return results.every((result) => result);
    }

    return results[0];
  }

  getPropertyValue(
    entry: string,
    propertyName: string,
    stat: Stats
  ): string | number {
    switch (propertyName) {
      case "name":
        return path.basename(entry);
      case "extension":
        return path.extname(entry).slice(1);
      case "size":
        return stat.size;
      case "created":
        return new Date(stat.birthtimeMs).toLocaleDateString("en-US");
      case "modified":
        return new Date(stat.mtime).toLocaleDateString("en-US");
      case "accessed":
        return new Date(stat.atime).toLocaleDateString("en-US");
      default:
        return "";
    }
  }

  compareValues(
    value: string | number,
    literalValue: string,
    operator: string
  ) {
    switch (operator) {
      case "=":
        const regexEquals = new RegExp(literalValue);
        return regexEquals.test(value.toString());
      case "!=":
        const regexNotEquals = new RegExp(literalValue);
        return !regexNotEquals.test(value.toString());
      case ">":
        return Number(value) > Number(literalValue);
      case "<":
        return Number(value) < Number(literalValue);
      case ">=":
        return Number(value) >= Number(literalValue);
      case "<=":
        return Number(value) <= Number(literalValue);
      default:
        return false;
    }
  }

  async apply(query: Query, results: string[] = []): Promise<string[]> {
    const startPath = path.join(this.directory, query.from);
    if (!existsSync(startPath)) return results;

    const entries = await readdir(startPath, { withFileTypes: true });
    const filtered = entries.filter((entry) => entry.name !== ".DS_Store");

    for (const dirent of filtered) {
      const entryPath = path.join(startPath, dirent.name);

      if (dirent.isFile() && query.target === "files") {
        if (await this.isMatch(entryPath, query.where)) {
          results.push(entryPath);
        }
      }

      if (dirent.isDirectory() && query.target === "folders") {
        if (await this.isMatch(entryPath, query.where)) {
          results.push(entryPath);
        }
      }
    }

    return results;
  }
}
