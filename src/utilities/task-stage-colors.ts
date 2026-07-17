export const taskStageColors: Record<string, string> = {
  TODO: "#8c8c8c",
  "IN PROGRESS": "#6B7A99",
  "IN REVIEW": "#B08D57",
  DONE: "#6B7A4F",
};

export const unassignedStageColor = "#B2643C";

export const getStageColor = (title: string) =>
  taskStageColors[title] ?? "#8c8c8c";
