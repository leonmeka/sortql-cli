import chalk from "chalk";
import inquirer from "inquirer";
import path from "path";
import { homedir } from "os";
import { promises as fs } from "fs";

const VERSION = "1.0.6";
const GITHUB_URL = "https://github.com/leonmeka/sortql";
const CONFIG_PATH = path.join(homedir(), ".sortql");

export function printHeader(config?: {
  directory: string;
  queries: string;
  watch: boolean;
}) {
  console.clear();
  console.log(chalk.blueBright("========================================"));
  console.log(chalk.blueBright(`SortQL CLI`));
  console.log(chalk.blueBright(`v.${VERSION}`));
  console.log(chalk.blueBright(`${GITHUB_URL}`));
  console.log(chalk.blueBright("========================================\n"));

  if (!config) return;

  console.log(chalk.gray(`sortQL is running with the following config:`));
  console.log(chalk.gray(`- config: ${CONFIG_PATH}`));
  console.log(chalk.gray(`- directory: ${config?.directory}`));
  console.log(chalk.gray(`- queries: ${config?.queries}`));
  console.log(chalk.gray(`- watch: ${config?.watch ? "enabled" : "disabled"}`));
  console.log(chalk.gray("\n"));
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
