import sqlite3InitModule, {
  Sqlite3Static,
  type Database,
} from "@sqlite.org/sqlite-wasm";
import type { TableColumn, TableSchema, Command } from "@/types/sql";

const log = console.log;
const error = console.error;

const start = (sqlite3: Sqlite3Static) => {
  log("Running SQLite3 version", sqlite3.version.libVersion);
  return new sqlite3.oo1.DB("/mydb.sqlite3", "ct");
};

export const initializeSQLite = async (): Promise<Database> => {
  try {
    log("Loading and initializing SQLite3 module...");
    const sqlite3 = await sqlite3InitModule({
      print: log,
      printErr: error,
    });

    log("Done initializing. Running demo...");

    return start(sqlite3);
  } catch (err: any) {
    error("Initialization error:", err.name, err.message);
    throw Error(err.message);
  }
};

export const API = {
  getTables: (db: Database) => {
    if (!db) {
      return [];
    }

    try {
      const result = db.exec({
        sql: "SELECT name FROM sqlite_master WHERE type='table';",
        rowMode: "object",
      }) as unknown as { name: string }[];

      const tables = result.map((table) => {
        let columns = db.exec({
          sql: `pragma table_info([${table.name}]);`,
          rowMode: "object",
        }) as unknown as TableColumn[];

        const length = db.exec({
          sql: `SELECT count(*) FROM ${table.name};`,
          rowMode: "object",
        }) as unknown as [{ "count(*)": number }];

        return {
          name: table.name,
          columns,
          rowCount: length[0]["count(*)"],
        };
      });

      return tables;
    } catch (err: any) {
      console.error(err.message);
      return [];
    }
  },
  indexSchema: (arr: TableSchema[]) => {
    let tables: string[] = [];
    let columns: string[] = [];

    for (let i = 0; i < arr.length; i++) {
      tables.push("`" + arr[i].name + "`");
      columns = columns.concat(
        arr[i].columns.map((c: TableColumn) => "`" + c.name + "`")
      );
    }

    return { tables, columns };
  },
  jsonToSQL: (tableName: string, jsonArray: { [key: string]: any }[]) => {
    if (!Array.isArray(jsonArray) || jsonArray.length === 0) {
      throw new Error("Invalid input: JSON array is required.");
    }

    const columns = Object.keys(jsonArray[0]);
    const columnDefinitions = columns.map((column) => {
      const columnType = typeof jsonArray[0][column];

      // Map JavaScript types to SQL types
      switch (columnType) {
        case "number":
          return `${column} INTEGER`;
        case "string":
          return `${column} TEXT`;
        case "boolean":
          return `${column} BOOLEAN`;
        default:
          return `${column} TEXT`; // Default to TEXT for unknown types
      }
    });

    const createTableStatement = `CREATE TABLE ${tableName} (${columnDefinitions.join(
      ", "
    )});`;

    const insertStatements = jsonArray
      .map((row) => {
        const values = columns.map((column) => {
          const value = row[column];
          if (typeof value === "string") {
            return `'${value.replace(/'/g, "''")}'`; // Escape single quotes in strings
          } else if (value === null || value === undefined) {
            return "NULL";
          } else {
            return value;
          }
        });

        return `INSERT INTO ${tableName} (${columns.join(
          ", "
        )}) VALUES (${values.join(", ")});`;
      })
      .join("\n");

    return `${createTableStatement}\n${insertStatements}`;
  },
  csvToSQL: (tableName: string, csvString: string) => {
    const lines = csvString.trim().split("\n");
    const headers = lines[0].split(",").map((header: string) => header.trim());

    // Infer column types based on the first data row
    const firstRow = lines[1]?.split(",").map((value: string) => value.trim());
    const columnDefinitions = headers.map((header: string, index) => {
      let columnType = "TEXT"; // Default type

      if (firstRow && firstRow[index] !== undefined) {
        const value = firstRow[index];
        if (!isNaN(Number(value))) {
          columnType = "INTEGER";
        } else if (
          value.toLowerCase() === "true" ||
          value.toLowerCase() === "false"
        ) {
          columnType = "BOOLEAN";
        }
      }

      return `${header} ${columnType}`;
    });

    const createTableStatement = `CREATE TABLE ${tableName} (${columnDefinitions.join(
      ", "
    )});`;

    const insertStatements = lines
      .slice(1)
      .map((line) => {
        const values = line.split(",").map((value, index) => {
          value = value.trim();
          const columnType = columnDefinitions[index].split(" ")[1];

          if (columnType === "TEXT" || columnType === "BOOLEAN") {
            return `'${value.replace(/'/g, "''")}'`; // Escape single quotes
          } else if (value === "") {
            return "NULL";
          } else {
            return value;
          }
        });

        return `INSERT INTO ${tableName} (${headers.join(
          ", "
        )}) VALUES (${values.join(", ")});`;
      })
      .join("\n");

    return `${createTableStatement}\n${insertStatements}`;
  },
};

export const keywords = [
  "abort",
  "action",
  "add",
  "after",
  "all",
  "alter",
  "always",
  "analyze",
  "and",
  "as",
  "asc",
  "attach",
  "autoincrement",
  "before",
  "begin",
  "between",
  "by",
  "cascade",
  "case",
  "cast",
  "check",
  "collate",
  "column",
  "commit",
  "count",
  "conflict",
  "constraint",
  "create",
  "cross",
  "current",
  "current_date",
  "current_time",
  "current_timestamp",
  "database",
  "default",
  "deferrable",
  "deferred",
  "delete",
  "desc",
  "detach",
  "distinct",
  "do",
  "drop",
  "each",
  "else",
  "end",
  "escape",
  "except",
  "exclude",
  "exclusive",
  "exists",
  "explain",
  "fail",
  "filter",
  "first",
  "following",
  "for",
  "foreign",
  "from",
  "full",
  "generated",
  "glob",
  "group",
  "groups",
  "having",
  "if",
  "ignore",
  "immediate",
  "in",
  "index",
  "indexed",
  "initially",
  "inner",
  "insert",
  "instead",
  "intersect",
  "into",
  "is",
  "isnull",
  "join",
  "key",
  "last",
  "left",
  "like",
  "limit",
  "match",
  "materialized",
  "natural",
  "no",
  "not",
  "nothing",
  "notnull",
  "null",
  "nulls",
  "of",
  "offset",
  "on",
  "or",
  "order",
  "others",
  "outer",
  "over",
  "partition",
  "plan",
  "pragma",
  "preceding",
  "primary",
  "query",
  "raise",
  "range",
  "recursive",
  "references",
  "regexp",
  "reindex",
  "release",
  "rename",
  "replace",
  "restrict",
  "returning",
  "right",
  "rollback",
  "row",
  "rows",
  "savepoint",
  "select",
  "set",
  "table",
  "temp",
  "temporary",
  "then",
  "ties",
  "to",
  "transaction",
  "trigger",
  "unbounded",
  "union",
  "unique",
  "update",
  "using",
  "vacuum",
  "values",
  "view",
  "virtual",
  "when",
  "where",
  "window",
  "with",
  "without",
];

export const keywordsMap = keywords.reduce(
  (agg: Record<string, string>, it: string) => {
    agg[it] = it;
    return agg;
  },
  {}
);
