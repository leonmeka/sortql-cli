import chalk from "chalk";

import { Query } from "@sortql/core/queries";

export class SelectQuery extends Query {
  validate() {}

  async execute() {
    const results = await this.filter.apply(this);

    console.log(chalk.yellowBright(`   ↳ [SELECT]: ${results.length}`));
  }
}
