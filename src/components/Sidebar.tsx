import { useState } from "react";

import { ResizableBox } from "react-resizable";
import { useAtom } from "jotai";
import { sideBarWidthAtom, themeAtom, tablesAtom } from "@/state";
import SidebarResizeHandle from "@/components/SidebarResizeHandle";
import { TableColumn } from "@/types/sql";
import SidebarTables from "./SidebarTables";

type ResizeCallbackData = {
  node: HTMLElement;
  size: { width: number; height: number };
  handle: ResizeHandleAxis;
};

type ResizeHandleAxis = "s" | "w" | "e" | "n" | "sw" | "nw" | "se" | "ne";

const navItems = ["tables", "settings"] as const;

export default function Sidebar() {
  const [sideBarWidthInPixels, setSideBarWidthInPixels] =
    useAtom(sideBarWidthAtom);
  const [theme] = useAtom(themeAtom);
  const [selectedRoute, setSelectedRoute] = useState<(typeof navItems)[number]>(
    navItems[0]
  );
  const [tables] = useAtom(tablesAtom);

  // On top layout
  const onResize = (
    _: React.SyntheticEvent<Element, Event>,
    { size }: ResizeCallbackData
  ) => {
    setSideBarWidthInPixels(size.width);
  };

  return (
    <ResizableBox
      width={sideBarWidthInPixels}
      height={window.innerHeight}
      onResize={onResize}
      handle={
        <SidebarResizeHandle sideBarWidthInPixels={sideBarWidthInPixels} />
      }
    >
      <div
        className="sidebar box-content"
        style={{
          width: `${sideBarWidthInPixels}px`,
          backgroundColor: theme.sidebar,
        }}
      >
        <nav className="flex">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => {
                setSelectedRoute(item);
              }}
              className="font-extrabold text-gray-800 rounded bg-gray-400 w-min px-1 text-sm ml-2"
              style={{
                backgroundColor:
                  selectedRoute === item
                    ? theme.sideBarTabActive
                    : "transparent",
                color:
                  selectedRoute === item
                    ? theme.sidebar
                    : theme.sideBarTabActive,
              }}
            >
              {item}
            </button>
          ))}
        </nav>
        <SidebarTables />
      </div>
    </ResizableBox>
  );
}
