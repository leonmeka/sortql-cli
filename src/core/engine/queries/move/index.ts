import path from "path";
import chalk from "chalk";

import { mkdir, rename } from "node:fs/promises";

import { Query } from "@sortql/core/engine/queries";
import { MoveStatement } from "@sortql/core/parser/types";

export class MoveQuery extends Query {
  constructor(directory: string, public statement: MoveStatement) {
    super(directory);
    this.validate();
  }

  validate() {
    const { from, to } = this.statement;

    if (to.value === from.value) {
      throw new Error("   ↳ [MOVE] Cannot move to the same location");
    }
  }

  async execute() {
    const { to } = this.statement;

    const results = await this.filter.apply(this.statement);

    if (results.length === 0) {
      return;
    }

    await mkdir(path.join(this.directory, to.value), { recursive: true });

    console.log(chalk.yellowBright(`   ↳ [MOVE]: ${results.length} to ${to}`));

    for (const result of results) {
      await rename(
        result,
        path.join(this.directory, to.value, path.basename(result))
      );
    }
  }
}
