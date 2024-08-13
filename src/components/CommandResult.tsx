import { useState } from "react";
import type { MouseEvent, KeyboardEvent } from "react";
import { keywordsMap } from "@/utils/sqlite";
import { Command } from "@/types/sql";
import { themeAtom } from "@/state";
import { useAtom } from "jotai";

type CommandResultProps = {
  command: Command;
  isActive: boolean;
  index: number;
  selectCommand: (event: MouseEvent<HTMLDivElement>) => void;
  handleKeyPressForPrevCommand: (event: KeyboardEvent<HTMLDivElement>) => void;
  reRunCommand: (command: Command) => void;
};

export default function CommandResult({
  command,
  isActive = false,
  index,
  selectCommand,
  handleKeyPressForPrevCommand,
  reRunCommand,
}: CommandResultProps) {
  const [theme] = useAtom(themeAtom);
  const [displayAsTable, setDisplayAsTable] = useState(true);

  const commandClass = isActive ? "prevCommand activeCommand" : "prevCommand";

  const _reRunCommand = (ev: MouseEvent<HTMLButtonElement>) => {
    reRunCommand(command);
  };

  const exportToJSON = () => {
    const { output } = command;

    if (!output) {
      return;
    }

    const data = JSON.stringify(output, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = command.id + "-data.json";

    a.click();

    a.remove();
  };

  const exportToCSV = () => {
    const { output } = command;

    if (!output) {
      return;
    }

    let csvString = "";

    if (output.length === 0) {
      return;
    }

    const headers = Object.keys(output[0]);

    csvString += headers.join(",") + "\n";

    for (let i = 0; i < output.length; i++) {
      const row = Object.values(output[i]);
      csvString += row.join(",") + "\n";
    }

    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = command.id + "-data.csv";

    a.click();

    a.remove();
  };

  const copyQueryToClipboard = () => {
    navigator.clipboard.writeText(command.text);
  };

  return (
    <div className="prevCommandWrapper">
      <div className={commandClass}>
        <div className="timestampText">{command.time.toLocaleTimeString()}</div>
        <div
          className="commandText whitespace-pre-wrap"
          data-index={index}
          onClick={selectCommand}
          onKeyDown={handleKeyPressForPrevCommand}
        >
          <SyntaxHighlightText>{command.text}</SyntaxHighlightText>
        </div>
        <div className="rerunSection">
          <button
            onMouseDown={_reRunCommand}
            className="runCommandBtn"
            title="re-run command"
          >
            »
          </button>
        </div>
      </div>
      {command.output ? (
        <div>
          <p className="text-xs text-gray-300 p-1">
            {command.output.length} row(s) returned{" "}
          </p>
          {command.output.length ? (
            <div>
              <button
                onMouseDown={() => setDisplayAsTable(!displayAsTable)}
                className="text-[0.5rem] text-gray-500 hover:text-blue-400 cursor-pointer border-transparent border hover:border-blue-400 rounded-sm  p-1"
              >
                Display as {displayAsTable ? "JSON" : "Table"}
              </button>
              {displayAsTable ? (
                <div className="resultBlockWrapper my-2 mx-1 rounded-sm">
                  <div className="resultBlock">
                    <table
                      className="border"
                      style={{ borderColor: theme.output }}
                    >
                      <thead>
                        <tr>
                          {Object.keys(command.output[0]).map((key, index) => (
                            <th
                              key={index}
                              className="border p-1 px-2 text-left"
                              style={{
                                borderColor: theme.sidebar,
                                color: theme.sidebar,
                                backgroundColor: theme.output,
                              }}
                            >
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {command.output.map(
                          (row: Record<string, any>, index) => (
                            <tr key={index}>
                              {Object.values(row).map((value, index) => (
                                <td
                                  key={index}
                                  className="border p-1 px-2 text-left"
                                  style={{ borderColor: theme.output }}
                                >
                                  {value}
                                </td>
                              ))}
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div>
                  <pre
                    className="resultBlock border my-2 mx-1 rounded"
                    style={{
                      borderColor: theme.input,
                    }}
                  >
                    {JSON.stringify(command.output, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ) : null}
          {command.output ? (
            <div>
              <button
                onMouseDown={exportToJSON}
                className="text-[0.5rem] text-gray-500 hover:text-blue-400 cursor-pointer border-transparent border hover:border-blue-400 rounded-sm  p-1"
              >
                Export to JSON
              </button>
              <button
                onMouseDown={exportToCSV}
                className="text-[0.5rem] text-gray-500 hover:text-green-400 cursor-pointer border-transparent border hover:border-green-400 rounded-sm  p-1"
              >
                Export to CSV
              </button>
              <button
                onMouseDown={copyQueryToClipboard}
                className="text-[0.5rem] text-gray-500 hover:text-purple-400 cursor-pointer border-transparent border hover:border-purple-400 rounded-sm  p-1"
              >
                Copy Query
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
      {command.error ? (
        <pre
          className="w-full bg-red-800 text-red errBlock"
          style={{ background: theme.error }}
        >
          {command.error}
        </pre>
      ) : null}
    </div>
  );
}

const SyntaxHighlightText = ({ children }: { children: string }) => {
  const textArr = children.split(" ");
  const [theme] = useAtom(themeAtom);

  return (
    <span>
      {textArr.map((str, index) => {
        if (keywordsMap[str.toLowerCase()]) {
          return (
            <span
              key={`${str}-${index}`}
              style={{ color: theme.syntaxHighlightMain }}
            >
              {str}{" "}
            </span>
          );
        }

        return <span key={`${str}-${index}`}>{str} </span>;
      })}
    </span>
  );
};
