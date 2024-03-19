import chalk from "chalk";
import path from "path";

import { Operation } from "@sortql/core/engine/operations";
import { Statement } from "@sortql/core/parser/types";

export class SelectOperation extends Operation {
  constructor(directory: string, public statement: Statement) {
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
        `↳ [SELECT]: ${results.length}:`,
        hasResults ? relativeResults : "No results found."
      )
    );
  }
}
