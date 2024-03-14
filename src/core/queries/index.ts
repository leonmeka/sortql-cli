import { Target } from "@sortql/core/parsers";
import { Filter, LogicalCondition } from "@sortql/core/filter";

export abstract class Query {
  public filter: Filter;

  constructor(
    public directory: string,
    public target: Target,
    public from: string,
    public where?: LogicalCondition
  ) {
    this.filter = new Filter(directory);
  }

  abstract validate(this: this): void;

  abstract execute(): Promise<void>;
}
