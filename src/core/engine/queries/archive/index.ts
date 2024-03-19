import path from "path";
import chalk from "chalk";
import archiver from "archiver";

import { createWriteStream } from "node:fs";

import { Query } from "@sortql/core/engine/queries";
import { ArchiveStatement } from "@sortql/core/parser/types";

export class ArchiveQuery extends Query {
  constructor(directory: string, public statement: ArchiveStatement) {
    super(directory);
    this.validate();
  }

  async validate() {
    const { from, to } = this.statement;

    if (path.extname(to.value) === "") {
      throw new SyntaxError("   ↳ [ARCHIVE] Destination cannot be a directory");
    }

    if (to.value === from.value) {
      throw new SyntaxError(
        "   ↳ [ARCHIVE] Cannot archive to the same location"
      );
    }
  }

  async execute() {
    const { target, to } = this.statement;

    const results = await this.filter.apply(this.statement);

    console.log(
      chalk.yellowBright(`   ↳ [ARCHIVE]: ${results.length} to ${to}`)
    );

    if (results.length === 0) {
      return;
    }

    const output = createWriteStream(path.join(this.directory, to.value));
    const archive = archiver("zip");

    archive.pipe(output);

    for (const result of results) {
      const destination = path.join(this.directory, to.value);

      if (target.value === "folders") {
        archive.directory(path.basename(result), destination);
      }

      if (target.value === "files") {
        archive.append(destination, { name: path.basename(result) });
      }
    }

    await archive.finalize();
  }
}
