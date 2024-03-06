import chalk from "chalk";

import { rm } from "fs/promises";

import { Query } from "@sortql/core/queries";

export class DeleteQuery extends Query {
  validate() {}

  async execute() {
    const results = await this.filter.apply(this);

    console.log(chalk.yellowBright(`   ↳ [DELETE]: ${results.length}`));

    for (const result of results) {
      await rm(result, { recursive: true });
    }
  }
}
