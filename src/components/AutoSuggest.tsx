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
  if (!coords) {
    return null;
  }
  let dynamicPositionStyle = {
    margin: "1rem 0 0 10rem",
    top: coords?.y,
    left: coords?.x,
  };
  // if the auto suggest would clip below the bottom of the window, subtract the height of the autosuggest from the top position

  const resultsHeight = results.length * 32;

  if (coords.y + resultsHeight > window.innerHeight) {
    dynamicPositionStyle.top = coords.y - resultsHeight;
    dynamicPositionStyle.margin = `-1rem 0 0 10rem`;
  }

  const selectedClassName = "p-1 font-bold bg-blue-600";
  const defaultClassName = "p-1";

  return (
    <div
      className="bg-gray-600"
      style={{
        position: "absolute",
        width: "10rem",
        ...dynamicPositionStyle,
      }}
    >
      {results.map((k, i) => (
        <div
          key={k}
          className={selectedIndex === i ? selectedClassName : defaultClassName}
        >
          {k}
        </div>
      ))}
    </div>
  );
}
