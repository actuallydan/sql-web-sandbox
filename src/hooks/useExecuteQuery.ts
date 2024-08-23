import { useSetAtom, useAtomValue } from "jotai";
import {
  commandsAtom,
  autoSuggestSchemaAtom,
  tablesAtom,
  databaseAtom,
} from "@/state"; // Assuming you've defined these atoms
import { API } from "@/utils/sqlite";
import { ulid } from "ulidx";

// Define the custom hook
export function useExecuteQuery() {
  const setCommands = useSetAtom(commandsAtom);
  const setAutoSuggestSchema = useSetAtom(autoSuggestSchemaAtom);
  const setTables = useSetAtom(tablesAtom);
  const db = useAtomValue(databaseAtom);

  const executeQuery = async (query: string) => {
    if (!db) {
      return;
    }

    const newId = ulid();

    try {
      setCommands((prevEvents) => {
        const newCommand = {
          time: new Date(),
          text: query,
          id: newId,
        };

        return [...prevEvents, newCommand];
      });

      const result = db.exec({
        sql: query,
        rowMode: "object",
      }) as unknown as any[];

      setCommands((prevCommands) => {
        const index = prevCommands.findIndex((c) => c.id === newId);
        let newCommands = [...prevCommands];
        if (index !== -1) {
          newCommands[index].output = result;
        }
        return newCommands;
      });

      const latestTables = API.getTables(db);
      const latestIndexedSchema = API.indexSchema(latestTables);

      setAutoSuggestSchema(latestIndexedSchema);
      setTables(latestTables);
    } catch (err: any) {
      console.error(err.message);

      setCommands((prevCommands) => {
        const index = prevCommands.findIndex((c) => c.id === newId);
        let newCommands = [...prevCommands];
        if (index !== -1) {
          newCommands[index].error = err.message;
        }
        return newCommands;
      });
    }
  };

  return executeQuery;
}
