import { parse } from "path";
import { stat } from "node:fs/promises";

import { BinaryExpression, Expression } from "@sortql/core/parser/types";

interface Properties {
  name: string;
  extension: string;
  size: number;
  created: Date;
  modified: Date;
  accessed: Date;
}

export type PropertyKey = keyof Properties;

export class Evaluator {
  static async evaluate(
    expression: Expression,
    path: string
  ): Promise<boolean> {
    return this.evaluateBinaryExpression(expression as BinaryExpression, path);
  }

  private static convertToType(value: string, type: PropertyKey) {
    switch (type) {
      case "name":
      case "extension":
        return value;
      case "size":
        return Number(value);
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
      name: parse(path).base,
      extension: parse(path).ext.slice(1),
      size: stats.size,
      created: stats.birthtime,
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
      case "EQUALS":
        return new RegExp(rightValue as string).test(leftValue as string);
      case "NOT_EQUALS":
        return !new RegExp(rightValue as string).test(leftValue as string);
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
