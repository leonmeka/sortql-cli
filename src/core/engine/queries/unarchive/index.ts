import path from "path";
import chalk from "chalk";
import AdmZip from "adm-zip";

import { Query } from "@sortql/core/engine/queries";
import { UnarchiveStatement } from "@sortql/core/parser/types";

export class UnarchiveQuery extends Query {
  constructor(directory: string, public statement: UnarchiveStatement) {
    super(directory);
    this.validate();
  }

  validate() {
    const { target, from, to } = this.statement;

    if (target.value === "folders") {
      throw new SyntaxError("   ↳ [UNARCHIVE] Cannot unarchive folders");
    }

    if (path.extname(to.value) !== "") {
      throw new SyntaxError("   ↳ [UNARCHIVE] Cannot unarchive to a file");
    }

    if (to === from) {
      throw new SyntaxError(
        "[UNARCHIVE] Cannot unarchive to the same location"
      );
    }
  }

  async execute() {
    const { to } = this.statement;

    const results = await this.filter.apply(this.statement);

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
      const destination = path.join(this.directory, to.value);

      new AdmZip(result).extractAllTo(destination, true);
    }
  }
}
