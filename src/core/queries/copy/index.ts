import path from "path";
import chalk from "chalk";

import { mkdir, cp, copyFile } from "fs/promises";

import { Query } from "@sortql/core/queries";
import { Target } from "@sortql/core/parsers";
import { LogicalCondition } from "@sortql/core/filter";

export class CopyQuery extends Query {
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
      throw new SyntaxError("   ↳ [COPY] Cannot copy to the same location");
    }
  }

  async execute() {
    const { directory, target, to } = this;

    const results = await this.filter.apply(this);

    console.log(chalk.yellowBright(`   ↳ [COPY]: ${results.length} to ${to}`));

    if (results.length === 0) {
      return;
    }

    await mkdir(path.join(directory, to), { recursive: true });

    for (const result of results) {
      const destintation = path.join(directory, to, path.basename(result));

      if (target === "folders") {
        await cp(result, destintation, { recursive: true });
        continue;
      }

      if (target === "files") {
        await copyFile(result, destintation);
        continue;
      }
    }
  }
}
