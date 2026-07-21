export const taskStageColors: Record<string, string> = {
  TODO: "#B8A888",
  "IN PROGRESS": "#7A8FAD",
  "IN REVIEW": "#C9B96A",
  DONE: "#6B9B5E",
};

export const unassignedStageColor = "#C0634A";

export const getStageColor = (title: string) =>
  taskStageColors[title] ?? "#B8A888";
