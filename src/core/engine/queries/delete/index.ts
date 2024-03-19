import chalk from "chalk";

import { rm } from "node:fs/promises";

import { Query } from "@sortql/core/engine/queries";
import { DeleteStatement } from "@sortql/core/parser/types";

export class DeleteQuery extends Query {
  constructor(directory: string, public statement: DeleteStatement) {
    super(directory);
    this.validate();
  }

  validate() {}

  async execute() {
    const results = await this.filter.apply(this.statement);

    console.log(chalk.yellowBright(`   ↳ [DELETE]: ${results.length}`));

    for (const result of results) {
      await rm(result, { recursive: true });
    }
  }
}
