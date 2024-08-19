export const sidebarStates = {
  TABLES: "tables",
  SETTINGS: "settings",
} as const;

export type SingleSidebarState =
  (typeof sidebarStates)[keyof typeof sidebarStates];
