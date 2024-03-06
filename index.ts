#!/usr/bin/env bun

import chalk from "chalk";

import { initSortQLCLI } from "@sortql/cli";

initSortQLCLI().catch((error) => {
  console.error(chalk.red(error));
  process.exit(1);
});
