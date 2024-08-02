export const numAbbrev = (num: number): string => {
  if (num < 1000) return num.toString();
  if (num < 1000000) return (num / 1000).toFixed(1) + "k";
  if (num < 1000000000) return (num / 1000000).toFixed(1) + "m";
  return (num / 1000000000).toFixed(1) + "b";
};

export const clamp = (num: number, min: number, max: number): number => {
  return Math.min(Math.max(num, min), max);
};
