import path from "path";
import { readdir, exists } from "node:fs/promises";

import { Statement } from "@sortql/core/parser/types";
import { Evaluator } from "@sortql/core/engine/evaluator";

export class Filter {
  constructor(public directory: string) {}

  async apply(statement: Statement): Promise<string[]> {
    const { target, from, where } = statement;

    if (["files", "folders"].indexOf(target.value) === -1) {
      throw new SyntaxError(`Unsupported target: '${target.value}'`);
    }

    const directory = path.join(this.directory, from.value);

    if (!(await exists(directory))) {
      throw new Error(`Directory does not exist: ${directory}`);
    }

    const entries = await readdir(directory, { withFileTypes: true });
    const filtered = entries.filter((entry) => entry.name !== ".DS_Store");

    let results: string[] = [];

    for (const dirent of filtered) {
      const entryPath = path.join(directory, dirent.name);

      const isMatch = where
        ? await Evaluator.evaluate(where.condition, entryPath)
        : true;

      if (isMatch) {
        if (
          (dirent.isFile() && target.value === "files") ||
          (dirent.isDirectory() && target.value === "folders")
        ) {
          results.push(entryPath);
        }
      }
    }

    return results;
  }
}
