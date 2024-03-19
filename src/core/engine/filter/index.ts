import path from "path";
import { readdir, stat, exists } from "node:fs/promises";

import {
  BinaryExpression,
  Expression,
  Statement,
  WhereClause,
} from "@sortql/core/parser/types";

export class Filter {
  constructor(public directory: string) {}

  async getFileProperties(filePath: string) {
    const stats = await stat(filePath);
    return {
      name: path.parse(filePath).base,
      extension: path.parse(filePath).ext.slice(1),
      size: stats.size,
    };
  }

  async evaluateExpression(
    expression: Expression,
    filePath: string
  ): Promise<boolean> {
    if (expression.type === "BinaryExpression") {
      const binaryExpression = expression as BinaryExpression;

      if (["AND", "OR"].includes(binaryExpression.operator)) {
        const leftResult = await this.evaluateExpression(
          binaryExpression.left,
          filePath
        );
        const rightResult = await this.evaluateExpression(
          binaryExpression.right,
          filePath
        );

        return binaryExpression.operator === "AND"
          ? leftResult && rightResult
          : leftResult || rightResult;
      } else {
        const fileProperties = await this.getFileProperties(filePath);
        let leftValue = fileProperties[binaryExpression.left.value];
        let rightValue = (binaryExpression.right as any).value;

        switch (binaryExpression.operator) {
          case "LIKE":
          case "EQUALS":
            return new RegExp(rightValue).test(leftValue);
          case "NOT_EQUALS":
            return !new RegExp(rightValue).test(leftValue);
          case "GREATER_THAN":
            return leftValue > rightValue;
          case "LESS_THAN":
            return leftValue < rightValue;
          case "GREATER_THAN_OR_EQUAL":
            return leftValue >= rightValue;
          case "LESS_THAN_OR_EQUAL":
            return leftValue <= rightValue;
          default:
            throw new Error(
              `Unsupported operator ${binaryExpression.operator}`
            );
        }
      }
    } else if (expression.type === "StringLiteral") {
      return filePath.includes(expression.value);
    } else {
      throw new Error(`Unsupported expression type: ${expression.type}`);
    }
  }

  async isMatch(whereClause: WhereClause, valueToCheck: any): Promise<boolean> {
    return await this.evaluateExpression(whereClause.condition, valueToCheck);
  }

  async apply(statement: Statement, results: string[] = []): Promise<string[]> {
    const { target, from, where } = statement;

    const startPath = path.join(this.directory, from.value);
    if (!(await exists(startPath))) return results;

    const entries = await readdir(startPath, { withFileTypes: true });
    const filtered = entries.filter((entry) => entry.name !== ".DS_Store");

    for (const dirent of filtered) {
      const entryPath = path.join(startPath, dirent.name);

      if (dirent.isFile() && target.value === "files") {
        if (where && !(await this.isMatch(where, entryPath))) {
          continue;
        }

        results.push(entryPath);
      }

      if (dirent.isDirectory() && target.value === "folders") {
        if (where && !(await this.isMatch(where, entryPath))) {
          continue;
        }

        results.push(entryPath);
      }
    }

    return results;
  }
}
