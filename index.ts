#!/usr/bin/env bun

import chalk from "chalk";

import { initSortQLCLI } from "@sortql/cli";

const handleCleanup = () => {
  console.log(chalk.yellow("\nExiting SortQL CLI..."));
  process.exit(0);
};

initSortQLCLI()
  .then(() => {
    process.on("SIGINT", handleCleanup);
  })
  .catch((error) => {
    console.error(chalk.red(error));
    process.exit(1);
  });
