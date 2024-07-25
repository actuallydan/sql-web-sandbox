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

  const selectedClassName = "p-1 font-bold bg-blue-600";
  const defaultClassName = "p-1";

  return (
    <div
      className="bg-gray-600"
      style={{
        position: "absolute",
        top: coords?.y,
        left: coords?.x,
        width: "10rem",
        margin: "1rem 0 0 10rem",
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
