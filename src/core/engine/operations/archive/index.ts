import path from "path";
import chalk from "chalk";
import archiver from "archiver";

import { createWriteStream } from "node:fs";

import { Operation } from "@sortql/core/engine/operations";
import { ArchiveStatement, Statement } from "@sortql/core/parser/types";

export class ArchiveOperation extends Operation {
  constructor(directory: string, public statement: Statement) {
    super(directory);
    this.validate();
  }

  validate() {
    const { from, to } = this.statement as ArchiveStatement;

    if (path.extname(to.value) === "") {
      throw new SyntaxError("↳ [ARCHIVE] Destination cannot be a directory");
    }

    if (to.value === from.value) {
      throw new SyntaxError("↳ [ARCHIVE] Cannot archive to the same location");
    }
  }

  async execute() {
    const { target, to } = this.statement as ArchiveStatement;

    const results = await this.filter.apply(this.statement);

    console.log(
      chalk.yellowBright(`↳ [ARCHIVE]: ${results.length} to ${to.value}`)
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
