"use client";

import {
  useState,
  useEffect,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import type { Database } from "@sqlite.org/sqlite-wasm";
import { initializeSQLite, keywords } from "../utils/sqlite";
import { ulid } from "ulidx";
import { getCaretCoordinates } from "@/utils/textarea";

type Command = {
  text: string;
  time: Date;
  id: string;
  output?: any[];
  error?: string;
};

type TableSchema = {
  name: string;
  columns: TableColumn[];
};

type TableColumn = {
  cid: number; // column id (index)
  name: string; // column tyoe
  type: string; // column data type (capitalized)
  notnull: number; // boolean
  dflt_value: any;
  pk: number; // boolean
};

function App() {
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);

  const [commands, setCommands] = useState<Command[]>(
    []
    //   [
    //   {
    //     "time": new Date("2024-06-26T17:18:32.163Z"),
    //     "text": "create table users (name text);",
    //     "id": "01J1ARWQPD1A0S7CHEXFT21CMM",
    //     "output": []
    //   },
    //   {
    //     "time": new Date("2024-06-26T17:18:53.056Z"),
    //     "text": "insert into users (name) values ('dan');",
    //     "id": "01J1ARXC3VXH77C6V7ZWXS5QS7",
    //     "output": []
    //   },
    //   {
    //     "time": new Date("2024-06-26T17:19:00.166Z"),
    //     "text": "select * from users;",
    //     "id": "01J1ARXK23N0XA5FN8VN8RRQ07",
    //     "output": [
    //       {
    //         "name": "dan"
    //       }
    //     ]
    //   }
    // ]
  );
  const [currentText, setCurrentText] = useState<string>("");
  const [commandCursor, setCommandCursor] = useState<number | null>(null);
  const [db, setDB] = useState<Database | null>(null);
  const [tables, setTables] = useState<TableSchema[]>([]);

  const handleKeyPress = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    switch (event.key) {
      case "Enter": {
        if (event.shiftKey) {
          return;
        }

        event.preventDefault();
        const text = currentText.trim();

        if (text === "") {
          return;
        }

        const newId = ulid();

        setCommands((prevEvents) => {
          const newCommand = {
            time: new Date(),
            text: text,
            id: newId,
          };

          return [...prevEvents, newCommand];
        });

        executeQuery(text, newId);
        setCurrentText("");
        setCommandCursor(null);

        break;
      }
      case "ArrowUp": {
        event.preventDefault();

        if (commandCursor === null && commands.length > 0) {
          setCommandCursor(commands.length - 1);
        } else if (commandCursor !== null && commandCursor - 1 >= 0) {
          setCommandCursor(commandCursor - 1);
        }
        break;
      }
      case "ArrowDown": {
        event.preventDefault();

        if (commandCursor !== null && commandCursor + 1 < commands.length) {
          setCommandCursor(commandCursor + 1);
        }
        if (commandCursor !== null && commandCursor + 1 >= commands.length) {
          setCommandCursor(null);
        }
        break;
      }
    }
  };

  const handleKeyPressForPrevCommand = (
    event: KeyboardEvent<HTMLDivElement>
  ) => {
    if (event.key !== "Enter" || commandCursor === null) {
      return;
    }

    event.preventDefault();

    const command = commands[commandCursor];

    if (command.text.trim() === "") {
      return;
    }

    const text = command.text.trim();

    const newId = ulid();

    setCommands((prevEvents) => {
      const newCommand = {
        time: new Date(),
        text,
        id: newId,
      };

      return [...prevEvents, newCommand];
    });

    executeQuery(text, newId);

    setCurrentText("");
    setCommandCursor(null);
  };
  const getTables = () => {
    if (!db) {
      return;
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

        return {
          name: table.name,
          columns,
        } as TableSchema;
      });

      setTables(tables);
    } catch (err: any) {
      console.error(err.message);
    }
  };
  const executeQuery = async (query: string, id: string) => {
    if (!db) {
      return;
    }

    try {
      let result = db.exec({
        sql: query,
        rowMode: "object",
      }) as unknown as any[];

      setCommands((prevCommands) => {
        const index = prevCommands.findIndex((c) => c.id === id);

        let newCommands = [...prevCommands];

        if (index !== -1) {
          newCommands[index].output = result;
        }
        return newCommands;
      });

      getTables();
    } catch (err: any) {
      console.error(err.message);

      setCommands((prevCommands) => {
        const index = prevCommands.findIndex((c) => c.id === id);

        let newCommands = [...prevCommands];

        if (index !== -1) {
          newCommands[index].error = err.message;
        }
        return newCommands;
      });
    }
  };

  const initSqlite = async () => {
    try {
      const newDB = await initializeSQLite();

      setDB(newDB);
    } catch (err: any) {
      console.error(err);
    }
  };

  const selectCommand = (event: MouseEvent<HTMLDivElement>) => {
    const index = event.currentTarget.getAttribute("data-index");
    if (!index) {
      return;
    }
    setCommandCursor(parseInt(index, 10));
  };

  useEffect(() => {
    initSqlite();
  }, []);

  useEffect(() => {
    if (commandCursor === null) {
      // setCurrentText('');
      return;
    }

    if (commands.length !== 0) {
      setCurrentText(commands[commandCursor].text);
      return;
    }
  }, [commandCursor]);

  const lastString = currentText.toLowerCase().match(/([a-zA-Z]+)$/);

  let matchingKeywords: string[] = [];

  if (lastString?.[0]) {
    matchingKeywords = keywords
      .filter((k) => k.includes(lastString[0]))
      .slice(0, 5);
  }

  return (
    <div id="root">
      <div className="sidebar">
        <h4>tables</h4>
        {tables.map((t) => (
          <div className="sidebar-table-wrapper" key={t.name}>
            <p>{t.name}</p>
            <ul>
              {t.columns.map((c: TableColumn) => (
                <li key={c.name}>
                  <span className="text-gray-400">└</span>
                  <span className="italic">{c.name}</span>
                  <span className="text-sm">{c.type}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="terminal">
        {/* output */}
        {commands.map((command, index) => {
          const commandClass =
            index === commandCursor
              ? "prevCommand activeCommand"
              : "prevCommand";

          return (
            <div key={command.id}>
              <div className={commandClass}>
                <div className="timestampText">
                  {command.time.toLocaleTimeString()}
                </div>
                <div
                  className="commandText"
                  data-index={index}
                  onClick={selectCommand}
                  onKeyDown={handleKeyPressForPrevCommand}
                >
                  {command.text}
                </div>
                <div className="rerunSection">
                  <button className="runCommandBtn">»</button>
                </div>
              </div>
              {command.output ? (
                <div>
                  <p className="text-xs text-gray-300 p-1">
                    {command.output.length} row(s) returned{" "}
                  </p>
                  <pre className="resultBlock">
                    {JSON.stringify(command.output, null, 2)}
                  </pre>
                </div>
              ) : null}
              {command.error ? (
                <pre className="w-full bg-red-800 text-red errBlock">
                  {command.error}
                </pre>
              ) : null}
            </div>
          );
        })}

        <textarea
          autoFocus
          tabIndex={0}
          onKeyDown={handleKeyPress}
          className="currCommand"
          value={currentText}
          onChange={(event) => {
            const lastString = event.target.value.match(/([a-zA-Z]+)$/);

            const elementPos = event.target.getBoundingClientRect();

            if (lastString?.[0]) {
              const element = event.target;
              const coords = getCaretCoordinates(
                element,
                element.selectionEnd - lastString[0].length,
                undefined
              );

              setCoords({ x: coords.left, y: coords.top + elementPos.top });
            } else {
              setCoords(null);
            }

            setCommandCursor(null);
            setCurrentText(event.target.value);
          }}
          placeholder="enter SQL commands..."
        />
        {coords ? (
          <div
            className="bg-gray-600"
            style={{
              position: "absolute",
              top: coords?.y,
              left: coords?.x,
              width: "10rem",
              margin: "1rem 0 0 10rem",
            }}
          >
            {matchingKeywords.map((k) => (
              <div key={k} className="p-1">
                {k}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default App;
