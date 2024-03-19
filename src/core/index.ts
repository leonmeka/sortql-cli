import chalk from "chalk";

import { Parser } from "@sortql/core/parser";
import { Engine } from "@sortql/core/engine";

export type Target = "files" | "folders";

export class Client {
  directory: string;
  parser: Parser;
  engine: Engine;

  constructor(directory: string) {
    this.directory = directory;
    this.parser = new Parser(directory);
    this.engine = new Engine();
  }

  async run(content: string) {
    try {
      console.log(chalk.blue(`→ Parsing queries...`));
      const parsed = this.parser.parse(content);
      console.log(chalk.green(`✓ Queries parsed successfully!`));

      console.log(chalk.blue(`→ Executing queries...`));
      await this.engine.execute(parsed);
      console.log(chalk.green(`✓ Queries executed successfully!`));
    } catch (e: any) {
      console.log(chalk.red(`✗ Error: ${e.message}`));
    }
  }
}
