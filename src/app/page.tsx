"use client"

import { useState, useEffect, type KeyboardEvent } from 'react';
import type { Database } from '@sqlite.org/sqlite-wasm';
import { initializeSQLite } from '../utils/sqlite';

type Command = {
  text: string;
  time: Date;
};

function App() {
  const [commands, setCommands] = useState<Command[]>([]);
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
        if (currentText.trim() === '') {
          return;
        }

        setCommands((prevEvents) => {
          const newCommand = {
            time: new Date(),
            text: currentText.trim(),
          };

          return [...prevEvents, newCommand];
        });

        executeQuery(currentText);

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

  const executeQuery = async (query: string) => {
    if (!db) {
      return;
    }

    let result = db.exec({
      sql: query,
      rowMode: 'object',
    });
    console.log(result);
  };

  const initSqlite = async () => {
    try {

      const newDB = await initializeSQLite();

      setDB(newDB);
    } catch (err: any) {
      console.error(err)
    }
  };

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

  return (
    <div className="wrapper">
      {/* output */}
      {commands.map((command) => (
        <div className="prevCommand" key={command.time.getTime()}>
          <span className="timestampText">
            {command.time.toLocaleTimeString()}
          </span>{' '}
          <span>{command.text}</span>
        </div>
      ))}

      <textarea
        onKeyDown={handleKeyPress}
        className="currCommand"
        value={currentText}
        onChange={(event) => {
          setCurrentText(event.target.value);
        }}
      />
      <span style={{ color: '#fff' }}>{commandCursor}</span>
    </div>
  );
}

export default App;
