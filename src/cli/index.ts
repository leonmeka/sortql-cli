import chalk from "chalk";
import path from "path";
import chokidar from "chokidar";

import { readFile } from "fs/promises";

import { QueryClient } from "@sortql/core";
import {
  printHeader,
  promptDirectory,
  promptQueries,
  promptWatch,
} from "@sortql/cli/dialogue";

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
  directory: string,
  queries: string
) {
  chokidar
    .watch(directory, {
      ignored: /(^|[\/\\])\../,
      persistent: true,
      ignorePermissionErrors: true,
      interval: 100,
    })
    .on("all", async () => {
      if (isBlocked) {
        return;
      }

      printHeader(directory, queries, true);
      await runQueries(client, queries);
    });
}

export async function initSortQLCLI() {
  printHeader();

  const queries = path.resolve(await promptQueries());
  const directory = path.resolve(await promptDirectory());
  const client = new QueryClient(directory);

  const isWatching = await promptWatch();

  if (isWatching) {
    await watchDirectory(client, directory, queries);
  }

  if (!isWatching) {
    printHeader(directory, queries);
    await runQueries(client, queries);
  }
}
