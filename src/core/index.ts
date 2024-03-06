import chalk from "chalk";

import { QueryParser } from "@sortql/core/parsers";

const QUERY_COMMENT_PREFIX = "--";

export class QueryClient {
  directory: string;
  queryParser: QueryParser;

  constructor(directory: string) {
    this.directory = directory;
    this.queryParser = new QueryParser(directory);
  }

  async run(content: string) {
    const queries = content
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith(QUERY_COMMENT_PREFIX));

    console.log(chalk.blue(`→ Running ${queries.length} queries...`));

    for (const query of queries) {
      const tokens = this.tokenize(query);
      const parsedQuery = this.queryParser.parse(tokens);
      if (parsedQuery) await parsedQuery.execute();
    }
  }

  tokenize(query: string): string[] {
    return (
      query
        .match(/'[^']*'|"[^"]*"|\S+/g)
        ?.map((token) =>
          token[0] === `'` || token[0] === `"` ? token.slice(1, -1) : token
        ) || []
    );
  }
}
