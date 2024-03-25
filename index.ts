#!/usr/bin/env node

import chalk from "chalk";

import { initSortQLCLI } from "@sortql/cli";

process.on("SIGINT", () => process.exit(1));

initSortQLCLI().catch((error) => {
  console.error(chalk.red(error));
  process.exit(1);
});
