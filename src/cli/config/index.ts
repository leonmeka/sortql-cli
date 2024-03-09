import chalk from "chalk";
import path from "path";

import { CONFIG_PATH } from "@sortql/cli";
import {
  promptDirectory,
  promptQueries,
  promptWatch,
} from "@sortql/cli/dialogue";

import { readFile, writeFile, access } from "fs/promises";
async function updateConfig(filePath: string) {
  console.log(chalk.blue("→ Entering configuration mode... \n"));

  const directory = path.resolve(await promptDirectory());
  const queries = path.resolve(await promptQueries());
  const watch = await promptWatch();

  const config = { directory, queries, watch };

  await writeFile(filePath, JSON.stringify(config, null, 2), {
    encoding: "utf8",
  });

  console.log(chalk.green("→ Created new .sortql config! \n"));

  return config;
}

export async function checkConfig() {
  if (process.argv.includes("--config")) {
    return await updateConfig(CONFIG_PATH);
  }

  try {
    console.log(chalk.blue("→ Checking for .sortql config file..."));

    await access(CONFIG_PATH);
    const config = JSON.parse(
      await readFile(CONFIG_PATH, { encoding: "utf8" })
    );

    console.log(
      chalk.green(`→ Found .sortql config file in ${CONFIG_PATH} \n`)
    );

    return config;
  } catch (error) {
    console.error(chalk.yellow("→ No .sortql config found. \n"));
    return await updateConfig(CONFIG_PATH);
  }
}
