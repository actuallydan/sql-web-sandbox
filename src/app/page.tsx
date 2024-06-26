"use client"

import { useState, useEffect, type KeyboardEvent, type MouseEvent } from 'react';
import type { Database } from '@sqlite.org/sqlite-wasm';
import { initializeSQLite } from '../utils/sqlite';
import { ulid } from "ulidx";

type Command = {
  text: string;
  time: Date;
  id: string;
  output?: any[];
  error?: string;
};

function App() {
  const [commands, setCommands] = useState<Command[]>([]
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
  const [currentText, setCurrentText] = useState<string>('');
  const [commandCursor, setCommandCursor] = useState<number | null>(null);
  const [db, setDB] = useState<Database | null>(null);

  const handleKeyPress = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    switch (event.key) {
      case 'Enter': {
        if (event.shiftKey) {
          return;
        }

        event.preventDefault();
        const text = currentText.trim();

        if (text === '') {
          return;
        }

        const newId = ulid();

        setCommands((prevEvents) => {
          const newCommand = {
            time: new Date(),
            text: text,
            id: newId
          };

          return [...prevEvents, newCommand];
        });

        executeQuery(text, newId);
        setCurrentText('');
        setCommandCursor(null);

        break;
      }
      case 'ArrowUp': {
        event.preventDefault();

        if (commandCursor === null && commands.length > 0) {
          setCommandCursor(commands.length - 1);
        } else if (commandCursor !== null && commandCursor - 1 >= 0) {
          setCommandCursor(commandCursor - 1);
        }
        break;
      }
      case 'ArrowDown': {
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

  const handleKeyPressForPrevCommand = (event: KeyboardEvent<HTMLDivElement>) => {
    console.log("called", event.key, commandCursor)
    if (event.key !== 'Enter' || commandCursor === null) {
      return
    }

    event.preventDefault();

    const command = commands[commandCursor];

    if (command.text.trim() === '') {
      return;
    }

    const text = command.text.trim()

    const newId = ulid();

    setCommands((prevEvents) => {
      const newCommand = {
        time: new Date(),
        text,
        id: newId
      };

      return [...prevEvents, newCommand];
    });

    executeQuery(text, newId);

    setCurrentText('');
    setCommandCursor(null);

  }
  const executeQuery = async (query: string, id: string) => {
    if (!db) {
      return;
    }

    try {

      let result = db.exec({
        sql: query,
        rowMode: 'object',
      }) as unknown as any[];

      console.log(result, id);

      setCommands((prevCommands) => {
        const index = prevCommands.findIndex(c => c.id === id);
        console.log({ index })
        let newCommands = [...prevCommands];

        if (index !== -1) {
          newCommands[index].output = result;
        }
        return newCommands;
      });

    } catch (err: any) {
      console.error(err.message)

      setCommands((prevCommands) => {
        const index = prevCommands.findIndex(c => c.id === id);
        console.log({ index })
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
      console.error(err)
    }
  };

  const selectCommand = (event: MouseEvent<HTMLDivElement>) => {
    const index = event.currentTarget.getAttribute('data-index');
    if (!index) {
      return;
    }
    setCommandCursor(parseInt(index, 10))
  }

  useEffect(() => {
    initSqlite();
  }, []);

  useEffect(() => {
    if (commandCursor === null) {
      setCurrentText('');
      return;
    }

    if (commands.length !== 0) {
      setCurrentText(commands[commandCursor].text);
      return;
    }
  }, [commandCursor]);

  console.log(commands)
  return (
    <div className="wrapper">
      {/* output */}
      {commands.map((command, index) => {

        const commandClass = index === commandCursor ? 'prevCommand activeCommand' : 'prevCommand';

        return (
          <div key={command.id}>

            <div className={commandClass}>
              <div className="timestampText">
                {command.time.toLocaleTimeString()}
              </div>
              <div className='commandText' data-index={index} onClick={selectCommand}
                onKeyDown={handleKeyPressForPrevCommand}
              >{command.text}</div>
              <div className='rerunSection'>
                {/* <button className='runCommandBtn'>»</button> */}
              </div>
            </div>
            {command.output ? <pre className="resultBlock">{JSON.stringify(command.output, null, 2)}</pre> : null}
            {command.error ? <pre className='w-full bg-red-800 text-red errBlock'>{command.error}</pre> : null}

          </div>
        )
      })}

      <textarea
        autoFocus
        tabIndex={0}
        onKeyDown={handleKeyPress}
        className="currCommand"
        value={currentText}
        onChange={(event) => {
          setCommandCursor(null)
          setCurrentText(event.target.value);
        }}
        placeholder='enter SQL commands...'
      />

    </div>
  );
}

export default App;
