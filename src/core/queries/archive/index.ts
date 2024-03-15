import path from "path";
import chalk from "chalk";
import archiver from "archiver";

import { createWriteStream } from "node:fs";

import { Query } from "@sortql/core/queries";
import { Target } from "@sortql/core/parsers";
import { LogicalCondition } from "@sortql/core/filter";

export class ArchiveQuery extends Query {
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

  async validate() {
    if (path.extname(this.to) === "") {
      throw new SyntaxError("   ↳ [ARCHIVE] Destination cannot be a directory");
    }

    if (this.to === this.from) {
      throw new SyntaxError(
        "   ↳ [ARCHIVE] Cannot archive to the same location"
      );
    }
  }

  async execute() {
    const { directory, target, to } = this;
    const results = await this.filter.apply(this);

    console.log(
      chalk.yellowBright(`   ↳ [ARCHIVE]: ${results.length} to ${to}`)
    );

    if (results.length === 0) {
      return;
    }

    const output = createWriteStream(path.join(directory, to));
    const archive = archiver("zip");

    archive.pipe(output);

    for (const result of results) {
      const destination = path.join(directory, to);

      if (target === "folders") {
        archive.directory(path.basename(result), destination);
      }

      if (target === "files") {
        archive.append(destination, { name: path.basename(result) });
      }
    }

    await archive.finalize();
  }
}
