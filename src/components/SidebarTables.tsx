import { tablesAtom, themeAtom } from "@/state";
import { TableColumn } from "@/types/sql";
import { useAtom } from "jotai";

export default function SidebarTables() {
  const [tables] = useAtom(tablesAtom);
  const [theme] = useAtom(themeAtom);

  return (
    <>
      {tables.map((t) => (
        <div className="sidebar-table-wrapper" key={t.name}>
          <p>
            {t.name}{" "}
            <span className="text-gray-400 text-[0.65rem]">
              {t.rowCount} row(s)
            </span>
          </p>
          <ul>
            {t.columns.map((c: TableColumn) => (
              <li key={c.name}>
                <span className="text-gray-500">└</span>
                <span className="italic">{c.name}</span>
                <span className="text-sm">
                  {c.type}
                  {c.pk ? (
                    <span
                      className="text-[1rem] text-[#ffdd00] ml-1 cursor-pointer"
                      style={{ color: theme.inputOutline }}
                      title="primary key"
                    >
                      ★
                    </span>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}
