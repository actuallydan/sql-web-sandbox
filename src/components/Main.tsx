"use client";

import {
  useState,
  useEffect,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import type { Database } from "@sqlite.org/sqlite-wasm";
import { API, initializeSQLite, keywords } from "../utils/sqlite";
import { ulid } from "ulidx";
import { getCaretCoordinates } from "@/utils/textarea";
import AutoSuggest from "./AutoSuggest";
import type { TableColumn, TableSchema, Command } from "@/types/sql";

function App() {
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);
  const [selectedAutoSuggestIndex, setSelectedAutoSuggestIndex] = useState(0);
  const [matchingKeywords, setMatchingKeywords] = useState<string[]>([]);
  const [autoSuggestSchema, setAutoSuggestSchema] = useState<{
    tables: string[];
    columns: string[];
  }>({ tables: [], columns: [] });
  const [commands, setCommands] = useState<Command[]>(
    // []
    [
      {
        time: new Date("2024-06-26T17:18:32.163Z"),
        text: "create table users (name text);",
        id: "01J1ARWQPD1A0S7CHEXFT21CMM",
        output: [],
      },
      {
        time: new Date("2024-06-26T17:18:53.056Z"),
        text: "insert into users (name) values ('dan');",
        id: "01J1ARXC3VXH77C6V7ZWXS5QS7",
        output: [],
      },
      {
        time: new Date("2024-06-26T17:19:00.166Z"),
        text: "select * from users;",
        id: "01J1ARXK23N0XA5FN8VN8RRQ07",
        output: [
          {
            name: "dan",
          },
        ],
      },
    ]
  );
  const [currentText, setCurrentText] = useState<string>("");
  const [commandCursor, setCommandCursor] = useState<number | null>(null);
  const [db, setDB] = useState<Database | null>(null);
  const [tables, setTables] = useState<TableSchema[]>([]);

  const navigateKeywordsInAutoSuggest = (
    event: KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (!matchingKeywords.length) {
      return;
    }

    switch (event.key) {
      case "Enter":
      case "Tab": {
        if (event.shiftKey) {
          return;
        }
        event.preventDefault();

        // replace the last string in currentText with the match at the last index and add a space
        const lastString = currentText.toLowerCase().match(/([a-zA-Z]+)$/);
        const text = currentText.replace(
          lastString?.[0] || "",
          matchingKeywords[selectedAutoSuggestIndex] + " "
        );
        setCurrentText(text);

        break;
      }
      case "ArrowUp": {
        setSelectedAutoSuggestIndex((prev) => {
          if (prev === 0) {
            return matchingKeywords.length - 1;
          }
          return prev - 1;
        });
        break;
      }
      case "ArrowDown": {
        setSelectedAutoSuggestIndex((prev) => {
          if (prev === matchingKeywords.length - 1) {
            return 0;
          }
          return prev + 1;
        });
        break;
      }
      case "Escape": {
        setMatchingKeywords([]);
        setSelectedAutoSuggestIndex(0);
        break;
      }
    }
  };
  const handleKeyPress = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (matchingKeywords.length > 0) {
      navigateKeywordsInAutoSuggest(event);
      return;
    }
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
      const latestTables = API.getTables(db);

      const latestIndexedSchema = API.indexSchema(latestTables);

      setAutoSuggestSchema(latestIndexedSchema);
      setTables(latestTables);
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

  useEffect(() => {
    const allKeywords = keywords
      .concat(autoSuggestSchema.tables)
      .concat(autoSuggestSchema.columns);

    if (currentText && coords) {
      const lastString = currentText.toLowerCase().match(/([a-zA-Z]+)$/);

      let matches: string[] = [];

      if (lastString?.[0]) {
        matches = allKeywords
          .filter((k) => k.includes(lastString[0]))
          .slice(0, 5);
      }

      setMatchingKeywords(matches);
    } else {
      setMatchingKeywords([]);
    }

    setSelectedAutoSuggestIndex(0);
  }, [currentText, coords]);

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

              setCoords({
                x: coords.left,
                y: coords.top + event.target.offsetTop,
              });
            } else {
              setCoords(null);
            }

            setCommandCursor(null);
            setCurrentText(event.target.value);
          }}
          placeholder="enter SQL commands..."
        />
        <AutoSuggest
          coords={coords}
          results={matchingKeywords}
          selectedIndex={selectedAutoSuggestIndex}
        />
      </div>
    </div>
  );
}

export default App;
