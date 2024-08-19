import { atom } from "jotai";
import type { TableSchema } from "@/types/sql";
import { sidebarStates, type SingleSidebarState } from "@/types/state";

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
