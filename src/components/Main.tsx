"use client";

import {
  useState,
  useEffect,
  type KeyboardEvent,
  type MouseEvent,
  type ChangeEvent,
} from "react";
import type { Database } from "@sqlite.org/sqlite-wasm";
import { API, initializeSQLite, keywords } from "../utils/sqlite";
import { ulid } from "ulidx";
import { getCaretCoordinates } from "@/utils/textarea";
import AutoSuggest from "./AutoSuggest";
import type { Command } from "@/types/sql";
import CommandResult from "./CommandResult";
import { sideBarWidthAtom, themeAtom, tablesAtom } from "@/state";
import { useAtom } from "jotai";
import Sidebar from "./Sidebar";

function App() {
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);
  const [selectedAutoSuggestIndex, setSelectedAutoSuggestIndex] = useState(0);
  const [matchingKeywords, setMatchingKeywords] = useState<string[]>([]);
  const [autoSuggestSchema, setAutoSuggestSchema] = useState<{
    tables: string[];
    columns: string[];
  }>({ tables: [], columns: [] });
  const [commands, setCommands] = useState<Command[]>([
    {
      time: new Date(),
      // this is all fucked up for escaping characters
      text: `

  +-----------------------------------------------+
  |                                               |
  |                                               |
  |                 ___        __                 |
  |                /\\_ \\    __/\\ \\__              |
  |    ____     __ \\//\\ \\  /\\_\\ \\ ,_\\    __       |
  |   /',__\\  /'__\`\\ \\ \\ \\ \\/\\ \\ \\ \\/  /'__\`\\     |
  |  /\\__, \`\\/\\ \\L\\ \\ \\_\\ \\_\\ \\ \\ \\ \\_/\\  __/     |
  |  \\/\\____/\\ \\___, \\/\\____\\\\ \\_\\ \\__\\ \\____\\    |
  |   \\/___/  \\/___/\\ \\/____/ \\/_/\\/__/\\/____/    |
  |                \\ \\_\\                          |
  |                 \\/_/                          |
  |         __                __                  |
  |        /\\ \\__            /\\ \\  __             |
  |    ____\\ \\ ,_\\  __  __   \\_\\ \\/\\_\\    ___     |
  |   /',__\\\\ \\ \\/ /\\ \\/\\ \\  /'_\` \\/\\ \\  / __\`\\   |
  |  /\\__, \`\\\\ \\ \\_\\ \\ \\_\\ \\/\\ \\L\\ \\ \\ \\/\\ \\L\\ \\  |
  |  \\/\\____/ \\ \\__\\\\ \\____/\\ \\___,_\\ \\_\\ \\____/  |
  |   \\/___/   \\/__/ \\/___/  \\/__,_ /\\/_/\\/___/   |
  |                                               |
  |                                               |
  +-----------------------------------------------+

        `,
      id: "01J1ARWQPD1A0S7CHEXFT21CMB",
      output: [],
    },
    // {
    //   time: new Date("2024-06-26T17:18:32.163Z"),
    //   text: "create table users (id integer primary key, name text);",
    //   id: "01J1ARWQPD1A0S7CHEXFT21CMM",
    //   output: [],
    // },
    // {
    //   time: new Date("2024-06-26T17:18:53.056Z"),
    //   text: "insert into users (name) values ('dan');",
    //   id: "01J1ARXC3VXH77C6V7ZWXS5QS7",
    //   output: [],
    // },
    // {
    //   time: new Date("2024-06-26T17:19:00.166Z"),
    //   text: "select * from users;",
    //   id: "01J1ARXK23N0XA5FN8VN8RRQ07",
    //   output: [
    //     {
    //       name: "dan",
    //     },
    //   ],
    // },
  ]);
  const [currentText, setCurrentText] = useState<string>("");
  const [commandCursor, setCommandCursor] = useState<number | null>(null);
  const [db, setDB] = useState<Database | null>(null);
  const [tables, setTables] = useAtom(tablesAtom);

  const [theme] = useAtom(themeAtom);
  const [windowResizeActive, setWindowResizeActive] = useState(false);
  const [sideBarWidthInPixels, setSideBarWidthInPixels] =
    useAtom(sideBarWidthAtom);

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

  const reRunCommand = (command: Command) => {
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
    } finally {
      const textarea = document.getElementById("terminalTextarea");
      if (textarea) {
        textarea.scrollIntoView();
      }
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

  const onTextareaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const lastString = event.target.value.match(/([a-zA-Z]+)$/);

    if (lastString?.[0]) {
      const element = event.target;
      const caretCoords = getCaretCoordinates(
        element,
        element.selectionEnd - lastString[0].length,
        undefined
      );

      setCoords({
        x: caretCoords.left,
        y: caretCoords.top + event.target.offsetTop,
      });
    } else {
      setCoords(null);
    }

    setCommandCursor(null);
    setCurrentText(event.target.value);
  };

  // for implementing typeahead
  // const { x, y } = document
  //   .getElementById("terminalTextarea")
  //   ?.getBoundingClientRect() || { x: -100, y: -100 };

  return (
    <div id="root">
      <Sidebar />
      <div
        className="terminal box-content"
        style={{
          marginLeft: `calc(${sideBarWidthInPixels}px + 1rem )`,
          width: `calc(100dvw - ${sideBarWidthInPixels}px - 1rem)`,
          backgroundColor: theme.terminal,
        }}
      >
        {commands.map((command, index) => {
          return (
            <CommandResult
              key={command.id}
              command={command}
              isActive={index === commandCursor}
              index={index}
              selectCommand={selectCommand}
              handleKeyPressForPrevCommand={handleKeyPressForPrevCommand}
              reRunCommand={reRunCommand}
            />
          );
        })}

        {/* <textarea
          value={currentText + " wiggity wack"}
          className="currCommand box-border leading-5 py-2 "
          style={{
            height: `${(currentText.split(/\n/g).length || 1) * 1.25 + 1}rem`,
            width: `calc(100dvw - ${sideBarWidthInPixels}px - 1rem)`,
            position: "absolute",
            top: y,
            left: x,
            background: "transparent",
            color: "#999",
            zIndex: 2,
          }}
        ></textarea> */}
        <textarea
          autoFocus
          tabIndex={0}
          onKeyDown={handleKeyPress}
          className="currCommand box-border leading-5 py-2"
          value={currentText}
          style={{
            height: `${(currentText.split(/\n/g).length || 1) * 1.25 + 1}rem`,
            width: `calc(100dvw - ${sideBarWidthInPixels}px - 1rem)`,
          }}
          id="terminalTextarea"
          onChange={onTextareaChange}
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
