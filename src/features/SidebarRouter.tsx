import SidebarTables from "@/components/SidebarTables";
import SidebarSettings from "@/components/SidebarSettings";
import { selectedSidebarRoute } from "@/state";
import { useAtom } from "jotai";

export default function SidebarRouter() {
  const [selectedRoute] = useAtom(selectedSidebarRoute);

  switch (selectedRoute) {
    case "tables":
      return <SidebarTables />;
    case "settings":
      return <SidebarSettings />;
    default:
      return null;
  }
}
