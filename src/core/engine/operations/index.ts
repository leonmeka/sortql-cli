import { Filter } from "@sortql/core/engine/filter";

export abstract class Operation {
  public directory: string;
  public filter: Filter;

  constructor(directory: string) {
    this.directory = directory;
    this.filter = new Filter(directory);
  }

  abstract validate(): void;

  abstract execute(): Promise<void>;
}
