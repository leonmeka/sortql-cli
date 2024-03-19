import path from "path";
import chalk from "chalk";
import AdmZip from "adm-zip";

import { Operation } from "@sortql/core/engine/operations";
import { Statement, UnarchiveStatement } from "@sortql/core/parser/types";

export class UnarchiveOperation extends Operation {
  constructor(directory: string, public statement: Statement) {
    super(directory);
    this.validate();
  }

  validate() {
    const { target, from, to } = this.statement as UnarchiveStatement;

    if (target.value === "folders") {
      throw new SyntaxError("↳ [UNARCHIVE] Cannot unarchive folders");
    }

    if (path.extname(to.value) !== "") {
      throw new SyntaxError("↳ [UNARCHIVE] Cannot unarchive to a file");
    }

    if (to === from) {
      throw new SyntaxError(
        "[UNARCHIVE] Cannot unarchive to the same location"
      );
    }
  }

  async execute() {
    const { to } = this.statement as UnarchiveStatement;

    const results = await this.filter.apply(this.statement);

    const filtered = results.filter(
      (result) => path.extname(result) === ".zip"
    );

    console.log(
      chalk.yellowBright(`↳ [UNARCHIVE]: ${filtered.length} to ${to.value}`)
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
