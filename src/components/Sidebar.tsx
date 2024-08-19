import { useState } from "react";

import { ResizableBox } from "react-resizable";
import { useAtom } from "jotai";
import {
  sideBarWidthAtom,
  themeAtom,
  tablesAtom,
  selectedSidebarRoute,
} from "@/state";
import SidebarResizeHandle from "@/components/SidebarResizeHandle";
import { sidebarStates, type SingleSidebarState } from "@/types/state";
import SidebarRouter from "@/features/SidebarRouter";

type ResizeCallbackData = {
  node: HTMLElement;
  size: { width: number; height: number };
  handle: ResizeHandleAxis;
};

type ResizeHandleAxis = "s" | "w" | "e" | "n" | "sw" | "nw" | "se" | "ne";

export default function Sidebar() {
  const [sideBarWidthInPixels, setSideBarWidthInPixels] =
    useAtom(sideBarWidthAtom);
  const [theme] = useAtom(themeAtom);
  const [selectedRoute, setSelectedRoute] = useAtom(selectedSidebarRoute);

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
          {Object.values(sidebarStates).map((item) => (
            <button
              key={item}
              onClick={() => {
                setSelectedRoute(item as SingleSidebarState);
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
        <SidebarRouter />
      </div>
    </ResizableBox>
  );
}
