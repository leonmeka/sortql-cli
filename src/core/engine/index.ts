import { Query, Statement } from "@sortql/core/parser/types";

import { SelectOperation } from "@sortql/core/engine/operations/select";
import { DeleteOperation } from "@sortql/core/engine/operations/delete";
import { MoveOperation } from "@sortql/core/engine/operations/move";
import { ArchiveOperation } from "@sortql/core/engine/operations/archive";
import { CopyOperation } from "@sortql/core/engine/operations/copy";
import { UnarchiveOperation } from "@sortql/core/engine/operations/unarchive";

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

    const { directory } = this._query;

    switch (statement.type) {
      case "SelectStatement":
        await new SelectOperation(directory, statement).execute();
        break;
      case "DeleteStatement":
        await new DeleteOperation(directory, statement).execute();
        break;
      case "MoveStatement":
        await new MoveOperation(directory, statement).execute();
        break;
      case "CopyStatement":
        await new CopyOperation(directory, statement).execute();
        break;
      case "ArchiveStatement":
        await new ArchiveOperation(directory, statement).execute();
        break;
      case "UnarchiveStatement":
        await new UnarchiveOperation(directory, statement).execute();
        break;
      default:
        break;
    }
  }
}
