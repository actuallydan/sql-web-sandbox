"use client";

import { Provider as JotaiProvider } from "jotai";
import type { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return <JotaiProvider>{children}</JotaiProvider>;
}
