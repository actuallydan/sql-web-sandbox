import { atom } from "jotai";
import type { Command, TableSchema } from "@/types/sql";
import { sidebarStates, type SingleSidebarState } from "@/types/state";
import type { Database } from "@sqlite.org/sqlite-wasm";

export const defaultTheme = {
  sidebar: "#111111",
  terminal: "#222222",
  input: "#333333",
  inputOutline: "#ffdd00",
  syntaxHighlightMain: "#60a5fa",
  autoSuggestHighlight: "#60a5fa",
  error: "#ff0000",
  sideBarTabActive: "#DDDDDD",
  output: "#e9e9e9",
};

const defaultValues = {
  sideBarWidth: 200,
  theme: defaultTheme,
};

export const sideBarWidthAtom = atom(defaultValues.sideBarWidth);

export const themeAtom = atom<typeof defaultTheme>(defaultValues.theme);

export const tablesAtom = atom<TableSchema[]>([]);

export const selectedSidebarRoute = atom<SingleSidebarState>(
  sidebarStates.TABLES
);

export const autoSuggestSchemaAtom = atom<{
  tables: string[];
  columns: string[];
}>({ tables: [], columns: [] });

export const databaseAtom = atom<Database | null>(null);

export const commandsAtom = atom<Command[]>([
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
