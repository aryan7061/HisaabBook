export const dealStageColors: Record<string, string> = {
  "NEW LEAD": "#8c8c8c",
  NEGOTIATION: "#6B7A99",
  WON: "#639922",
  LOST: "#E24B4A",
};

export const getDealStageColor = (title?: string) =>
  (title && dealStageColors[title]) ?? "#8c8c8c";
