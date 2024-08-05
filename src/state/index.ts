import { atom } from "jotai";

const defaultTheme = {
  sidebar: "#111",
  terminal: "#222",
  input: "#333",
  inputOutline: "#ffdd00",
  syntaxHighlightMain: "#60a5fa",
  autoSuggestHighlight: "#60a5fa",
  error: "#ff0000",
  sideBarTabActive: "#DDD",
};

const defaultValues = {
  sideBarWidth: 200,
  theme: defaultTheme,
};

export const sideBarWidthAtom = atom(defaultValues.sideBarWidth);

export const themeAtom = atom<typeof defaultTheme>(defaultValues.theme);
