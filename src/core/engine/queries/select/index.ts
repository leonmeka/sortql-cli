import chalk from "chalk";
import path from "path";

import { Query } from "@sortql/core/engine/queries";
import { SelectStatement } from "@sortql/core/parser/types";

export class SelectQuery extends Query {
  constructor(directory: string, public statement: SelectStatement) {
    super(directory);
    this.validate();
  }

  validate() {}

  async execute() {
    const results = await this.filter.apply(this.statement);

    const hasResults = results.length > 0;
    const relativeResults = results.map(
      (result) => ` ${path.relative(this.directory, result)}`
    );

    console.log(
      chalk.yellowBright(
        `   ↳ [SELECT]: ${results.length}:`,
        hasResults ? relativeResults : "No results found."
      )
    );
  }
}
