import type { MouseEvent, KeyboardEvent } from "react";
import { keywordsMap } from "@/utils/sqlite";
import { Command } from "@/types/sql";

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
  const commandClass = isActive ? "prevCommand activeCommand" : "prevCommand";

  const _reRunCommand = (ev: MouseEvent<HTMLButtonElement>) => {
    reRunCommand(command);
  };

  return (
    <div className="prevCommandWrapper">
      <div className={commandClass}>
        <div className="timestampText">{command.time.toLocaleTimeString()}</div>
        <div
          className="commandText"
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
}

const SyntaxHighlightText = ({ children }: { children: string }) => {
  const textArr = children.split(" ");

  return (
    <span>
      {textArr.map((str, index) => {
        if (keywordsMap[str.toLowerCase()]) {
          return (
            <span key={`${str}-${index}`} className="text-blue-400">
              {str}{" "}
            </span>
          );
        }

        return <span key={`${str}-${index}`}>{str} </span>;
      })}
    </span>
  );
};
