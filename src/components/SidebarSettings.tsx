import React, { useDeferredValue } from "react";
import { useAtom } from "jotai";
import { themeAtom, defaultTheme } from "@/state";

const SidebarSettings: React.FC = () => {
  const [_theme, setTheme] = useAtom(themeAtom);
  const theme = useDeferredValue(_theme);

  const handleColorChange = (field: string, color: string) => {
    setTheme((prevFieldColors) => ({
      ...prevFieldColors,
      [field]: color,
    }));
  };

  const reset = () => {
    setTheme({
      ...defaultTheme,
    });
  };

  return (
    <div className="m-4">
      {Object.entries(theme).map(([field, color]) => (
        <div key={field} className="flex flex-col mb-4">
          <label htmlFor={field}>{field}</label>
          <input
            type="color"
            id={field}
            value={color}
            onChange={(e) => handleColorChange(field, e.target.value)}
            className="rounded border-transparent"
          />
        </div>
      ))}
      <button
        className="bg-white text-black border-black p-1 rounded"
        onClick={reset}
      >
        Reset to defaults
      </button>
    </div>
  );
};

export default SidebarSettings;
