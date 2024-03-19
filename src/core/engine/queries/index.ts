import { Filter } from "@sortql/core/engine/filter";

export abstract class Query {
  public filter: Filter;
  public directory: string;

  constructor(directory: string) {
    this.directory = directory;
    this.filter = new Filter(directory);
  }

  abstract validate(): void;

  abstract execute(): Promise<void>;
}
