import { sideBarWidthAtom, themeAtom } from "@/state";

import { useAtom } from "jotai";

type AutoSuggestProps = {
  coords: {
    x: number;
    y: number;
  } | null;
  results: string[];
  selectedIndex: number | null;
};

export default function AutoSuggest({
  coords,
  results,
  selectedIndex = 0,
}: AutoSuggestProps) {
  const [marginLeft] = useAtom(sideBarWidthAtom);
  const [theme] = useAtom(themeAtom);

  if (!coords) {
    return null;
  }

  let dynamicPositionStyle = {
    margin: `1rem 0 0 ${marginLeft}px`,
    marginLeft: `calc(${marginLeft}px + 0.75rem)`,
    top: coords?.y,
    left: coords?.x,
  };

  // if the auto suggest would clip below the bottom of the window, subtract the height of the autosuggest from the top position
  const resultsHeight = results.length * 32;

  if (coords.y + resultsHeight > window.innerHeight) {
    dynamicPositionStyle.top = coords.y - resultsHeight;
    dynamicPositionStyle.margin = `-1rem 0 0 ${marginLeft}px`;
    dynamicPositionStyle.marginLeft = `calc(${marginLeft}px + 0.75rem)`;
  }

  const selectedClassName = "p-1 font-bold font-mono bg-blue-600";
  const defaultClassName = "p-1 font-mono ";

  return (
    <div
      style={{
        position: "absolute",
        width: "10rem",
        backgroundColor: theme.sidebar,
        ...dynamicPositionStyle,
      }}
    >
      {results.map((k, i) => (
        <div
          key={k}
          className={selectedIndex === i ? selectedClassName : defaultClassName}
          style={{
            backgroundColor:
              selectedIndex === i ? theme.autoSuggestHighlight : "initial",
          }}
        >
          {k}
        </div>
      ))}
    </div>
  );
}
