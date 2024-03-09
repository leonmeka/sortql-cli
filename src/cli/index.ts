import chalk from "chalk";
import { homedir } from "os";
import path from "path";
import chokidar from "chokidar";

import { readFile, writeFile, access } from "fs/promises";

import { QueryClient } from "@sortql/core";
import {
  printHeader,
  promptDirectory,
  promptQueries,
  promptWatch,
} from "@sortql/cli/dialogue";

export const VERSION = "1.0.7";
export const GITHUB_URL = "https://github.com/leonmeka/sortql";
export const CONFIG_PATH = path.join(homedir(), ".sortql");

let isBlocked = false;

async function runQueries(client: QueryClient, queries: string) {
  if (isBlocked) {
    return;
  }

  isBlocked = true;

  try {
    const content = await readFile(queries, {
      encoding: "utf8",
    });

    await client.run(content);

    console.log(chalk.green("→ Queries ran successfully!"));
  } catch (error) {
    console.error(chalk.red("Error running queries:"), error);
  } finally {
    isBlocked = false;
  }
}

async function watchDirectory(
  client: QueryClient,
  config: {
    directory: string;
    queries: string;
    watch: boolean;
  }
) {
  chokidar
    .watch(config.directory, {
      ignored: /(^|[\/\\])\../,
      persistent: true,
      ignorePermissionErrors: true,
      interval: 100,
    })
    .on("all", async () => {
      if (isBlocked) {
        return;
      }

      printHeader(config);
      await runQueries(client, config.queries);
    });
}

async function updateConfig(filePath: string) {
  console.log(chalk.blue("→ Entering configuration mode... \n"));

  const directory = await promptDirectory();
  const queries = await promptQueries();
  const watch = await promptWatch();

  const config = { directory, queries, watch };

  await writeFile(filePath, JSON.stringify(config, null, 2), {
    encoding: "utf8",
  });

  console.log(chalk.green("→ Created new .sortql config! \n"));

  return config;
}

async function checkConfig() {
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

export async function initSortQLCLI() {
  printHeader();
  const config = await checkConfig();

  const client = new QueryClient(config.directory);

  if (config.watch) {
    await watchDirectory(client, config);
  }

  if (!config.watch) {
    printHeader(config);
    await runQueries(client, config.queries);
  }
}
