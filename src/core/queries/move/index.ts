import path from "path";
import chalk from "chalk";

import { mkdir, rename } from "node:fs/promises";

import { Query } from "@sortql/core/queries";
import { Target } from "@sortql/core/parsers";
import { LogicalCondition } from "@sortql/core/filter";

export class MoveQuery extends Query {
  constructor(
    directory: string,
    target: Target,
    from: string,
    public to: string,
    where?: LogicalCondition
  ) {
    super(directory, target, from, where);
    this.validate();
  }

  validate() {
    if (this.to === this.from) {
      throw new Error("   ↳ [MOVE] Cannot move to the same location");
    }
  }

  async execute() {
    const { directory, to } = this;

    const results = await this.filter.apply(this);

    if (results.length === 0) {
      return;
    }

    await mkdir(path.join(directory, to), { recursive: true });

    console.log(chalk.yellowBright(`   ↳ [MOVE]: ${results.length} to ${to}`));

    for (const result of results) {
      await rename(result, path.join(directory, to, path.basename(result)));
    }
  }
}
