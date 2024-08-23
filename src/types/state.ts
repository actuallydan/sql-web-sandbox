export const sidebarStates = {
  TABLES: "tables",
  SETTINGS: "settings",
  IMPORT: "import",
} as const;

export type SingleSidebarState =
  (typeof sidebarStates)[keyof typeof sidebarStates];
