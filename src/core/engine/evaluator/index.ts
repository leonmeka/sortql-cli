import { parse } from "path";

import { stat, readFile } from "node:fs/promises";

import { BinaryExpression, Expression } from "@sortql/core/parser/types";
import { Properties, PropertyKey } from "@sortql/core/engine/evaluator/types";

export class Evaluator {
  static async evaluate(
    expression: Expression,
    path: string
  ): Promise<boolean> {
    if (expression.type === "BinaryExpression") {
      return this.evaluateBinaryExpression(
        expression as BinaryExpression,
        path
      );
    }

    if (expression.type === "StringLiteral") {
      return path.includes(expression.value);
    }

    throw new Error(`Unsupported expression type: ${expression.type}`);
  }

  private static convertToType(value: string, type: PropertyKey) {
    switch (type) {
      case "name":
      case "extension":
        return value;
      case "size":
        return Number(value);
      case "content":
        return value;
      case "created":
      case "modified":
      case "accessed":
        return new Date(value);

      default:
        throw new Error(`Unsupported property type: ${type}`);
    }
  }

  static async getProperties(path: string): Promise<Properties> {
    const stats = await stat(path);

    return {
      name: parse(path).name,
      extension: parse(path).ext.slice(1),
      size: stats.size,
      content: stats.isFile() ? (await readFile(path)).toString() : "",
      created: stats.birthtimeMs === 0 ? stats.ctime : stats.birthtime,
      modified: stats.mtime,
      accessed: stats.atime,
    };
  }

  private static async evaluateBinaryExpression(
    expression: BinaryExpression,
    path: string
  ): Promise<boolean> {
    if (["AND", "OR"].includes(expression.operator)) {
      const leftResult = await this.evaluate(expression.left, path);
      const rightResult = await this.evaluate(expression.right, path);

      return expression.operator === "AND"
        ? leftResult && rightResult
        : leftResult || rightResult;
    }

    const fileProperties = await this.getProperties(path);

    const leftValue = fileProperties[expression.left.value as PropertyKey];
    const rightValue = this.convertToType(
      expression.right.value,
      expression.left.value
    );

    switch (expression.operator) {
      case "LIKE":
        return new RegExp(rightValue as string).test(leftValue as string);
      case "EQUALS":
        return leftValue === rightValue;
      case "NOT_EQUALS":
        return leftValue !== rightValue;
      case "GREATER_THAN":
        return leftValue > rightValue;
      case "LESS_THAN":
        return leftValue < rightValue;
      case "GREATER_THAN_OR_EQUAL":
        return leftValue >= rightValue;
      case "LESS_THAN_OR_EQUAL":
        return leftValue <= rightValue;
      default:
        throw new Error(`Unsupported operator ${expression.operator}`);
    }
  }
}
