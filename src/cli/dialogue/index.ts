import chalk from "chalk";
import inquirer from "inquirer";
import boxen from "boxen";
import { promises as fs } from "node:fs";

import { VERSION, GITHUB_URL, CONFIG_PATH } from "@sortql/cli";

export function printHeader(config?: {
  directory: string;
  queries: string;
  watch: boolean;
}) {
  console.clear();

  const boxenOptions = {
    padding: 1,
    borderStyle: "round",
    borderColor: "blue",
  } as const;

  const headerText =
    chalk.blueBright(`v.${VERSION}\n`) +
    chalk.blueBright(`MIT License\n`) +
    chalk.blueBright(`${GITHUB_URL}`);

  console.log(
    boxen(headerText, {
      title: "sortQL CLI",
      titleAlignment: "center",
      ...boxenOptions,
    }) + "\n"
  );

  if (!config) return;

  const configDetails =
    chalk.gray(`sortQL is running with the following config:\n`) +
    chalk.gray(`- config: ${CONFIG_PATH}\n`) +
    chalk.gray(`- directory: ${config?.directory}\n`) +
    chalk.gray(`- queries: ${config?.queries}\n`) +
    chalk.gray(`- watch: ${config?.watch ? "enabled" : "disabled"}`);

  console.log(configDetails + "\n");
}

export async function promptDirectory() {
  const { directory } = await inquirer.prompt({
    type: "input",
    name: "directory",
    message: "Where do you want to run the queries?",
    filter: (input) => input.trim().replace(/['"]+/g, ""),
    validate: async (input) => {
      if (!input)
        return console.log(chalk.red("Please enter a directory")), false;

      try {
        const stats = await fs.stat(input);
        if (!stats.isDirectory()) throw new Error();

        return true;
      } catch {
        console.log(chalk.red("Please enter a valid directory"));
        return false;
      }
    },
  });

  return directory;
}

export async function promptQueries() {
  const { queries } = await inquirer.prompt({
    type: "input",
    name: "queries",
    message: "Where is your queries.sql file located?",
    filter: (input) => input.trim().replace(/['"]+/g, ""),
    validate: async (input) => {
      if (!input)
        return console.log(chalk.red("Please enter a file path")), false;

      try {
        const stats = await fs.stat(input);
        if (!stats.isFile()) throw new Error();

        return true;
      } catch {
        console.log(chalk.red("Please enter a valid file path"));
        return false;
      }
    },
  });

  return queries;
}

export async function promptWatch() {
  const { watch } = await inquirer.prompt({
    type: "confirm",
    name: "watch",
    message:
      "Do you want to watch the directory for changes and rerun queries?",
    default: false,
  });

  return watch;
}
