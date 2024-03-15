import path from "path";
import chalk from "chalk";
import AdmZip from "adm-zip";

import {} from "node:fs/promises";

import { Query } from "@sortql/core/queries";
import { Target } from "@sortql/core/parsers";
import { LogicalCondition } from "@sortql/core/filter";

export class UnarchiveQuery extends Query {
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
    if (this.target === "folders") {
      throw new SyntaxError("   ↳ [UNARCHIVE] Cannot unarchive folders");
    }

    if (path.extname(this.to) !== "") {
      throw new SyntaxError("   ↳ [UNARCHIVE] Cannot unarchive to a file");
    }

    if (this.to === this.from) {
      throw new SyntaxError(
        "[UNARCHIVE] Cannot unarchive to the same location"
      );
    }
  }

  async execute() {
    const { directory, to } = this;

    const results = await this.filter.apply(this);
    const filtered = results.filter(
      (result) => path.extname(result) === ".zip"
    );

    console.log(
      chalk.yellowBright(`   ↳ [UNARCHIVE]: ${filtered.length} to ${to}`)
    );

    if (filtered.length === 0) {
      return;
    }

    for (const result of filtered) {
      const destination = path.join(directory, to);

      new AdmZip(result).extractAllTo(destination, true);
    }
  }
}
