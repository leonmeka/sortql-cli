import path from "path";
import chalk from "chalk";

import { mkdir, cp, copyFile } from "node:fs/promises";

import { Query } from "@sortql/core/engine/queries";
import { CopyStatement } from "@sortql/core/parser/types";

export class CopyQuery extends Query {
  constructor(directory: string, public statement: CopyStatement) {
    super(directory);
    this.validate();
  }

  validate() {
    const { from, to } = this.statement;

    if (to.value === from.value) {
      throw new SyntaxError("   ↳ [COPY] Cannot copy to the same location");
    }
  }

  async execute() {
    const { target, to } = this.statement;

    const results = await this.filter.apply(this.statement);

    console.log(chalk.yellowBright(`   ↳ [COPY]: ${results.length} to ${to}`));

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
