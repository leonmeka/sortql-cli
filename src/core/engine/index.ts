import {
  ArchiveStatement,
  CopyStatement,
  DeleteStatement,
  MoveStatement,
  Query,
  SelectStatement,
  Statement,
  UnarchiveStatement,
} from "@sortql/core/parser/types";

import { SelectQuery } from "@sortql/core/engine/queries/select";
import { DeleteQuery } from "@sortql/core/engine/queries/delete";
import { MoveQuery } from "@sortql/core/engine/queries/move";
import { ArchiveQuery } from "@sortql/core/engine/queries/archive";
import { CopyQuery } from "@sortql/core/engine/queries/copy";
import { UnarchiveQuery } from "@sortql/core/engine/queries/unarchive";

export class Engine {
  private _query: Query | null = null;

  constructor() {
    this._query = null;
  }

  async execute(query: Query): Promise<void> {
    this._query = query;

    for (const statement of this._query.statements) {
      await this.executeStatement(statement);
    }
  }

  private async executeStatement(statement: Statement): Promise<void> {
    if (!this._query) return;

    let query;

    switch (statement.type) {
      case "SelectStatement":
        query = new SelectQuery(
          this._query.directory,
          statement as SelectStatement
        );
        break;
      case "DeleteStatement":
        query = new DeleteQuery(
          this._query.directory,
          statement as DeleteStatement
        );
        break;
      case "MoveStatement":
        query = new MoveQuery(
          this._query.directory,
          statement as MoveStatement
        );
        break;
      case "CopyStatement":
        query = new CopyQuery(
          this._query.directory,
          statement as CopyStatement
        );
        break;
      case "ArchiveStatement":
        query = new ArchiveQuery(
          this._query.directory,
          statement as ArchiveStatement
        );
        break;
      case "UnarchiveStatement":
        query = new UnarchiveQuery(
          this._query.directory,
          statement as UnarchiveStatement
        );
        break;
      default:
        break;
    }

    if (query) {
      await query.execute();
    }
  }
}
