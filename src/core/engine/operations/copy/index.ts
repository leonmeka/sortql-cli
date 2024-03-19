import path from "path";
import chalk from "chalk";

import { mkdir, cp, copyFile } from "node:fs/promises";

import { Operation } from "@sortql/core/engine/operations";
import { CopyStatement, Statement } from "@sortql/core/parser/types";

export class CopyOperation extends Operation {
  constructor(directory: string, public statement: Statement) {
    super(directory);
    this.validate();
  }

  validate() {
    const { from, to } = this.statement as CopyStatement;

    if (to.value === from.value) {
      throw new SyntaxError("↳ [COPY] Cannot copy to the same location");
    }
  }

  async execute() {
    const { target, to } = this.statement as CopyStatement;

    const results = await this.filter.apply(this.statement);

    console.log(chalk.yellowBright(`↳ [COPY]: ${results.length} to ${to}`));

    if (results.length === 0) {
      return;
    }

    await mkdir(path.join(this.directory, to.value), { recursive: true });

    for (const result of results) {
      const destintation = path.join(
        this.directory,
        to.value,
        path.basename(result)
      );

      if (target.value === "folders") {
        await cp(result, destintation, { recursive: true });
        continue;
      }

      if (target.value === "files") {
        await copyFile(result, destintation);
        continue;
      }
    }
  }
}
