import sqlite3InitModule, {
  Sqlite3Static,
  type Database,
} from "@sqlite.org/sqlite-wasm";

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
