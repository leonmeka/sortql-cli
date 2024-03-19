import chalk from "chalk";

import { rm } from "node:fs/promises";

import { Operation } from "@sortql/core/engine/operations";
import { Statement } from "@sortql/core/parser/types";

export class DeleteOperation extends Operation {
  constructor(directory: string, public statement: Statement) {
    super(directory);
    this.validate();
  }

  validate() {}

  async execute() {
    const results = await this.filter.apply(this.statement);

    console.log(chalk.yellowBright(`↳ [DELETE]: ${results.length}`));

    for (const result of results) {
      await rm(result, { recursive: true });
    }
  }
}
