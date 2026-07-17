import { UpcomingEvents } from "./home/upcoming-events";
import { DealsChart } from "./home/deals-chart";
import { WinRateCard } from "./home/win-rate-card";
import { TaskStageFlow } from "./home/task-stage-flow";
import UpcomingEventsSkeleton from "./skeleton/upcoming-events";
import AccordionHeaderSkeleton from "./skeleton/accordion-header";
import KanbanColumnSkeleton from "./skeleton/kanban";
import LatestActivitiesSkeleton from "./skeleton/latest-activities";
import ProjectCardSkeleton from "./skeleton/project-card";
import { DashboardTotalCountCard } from "./home/total-count-card";
import { LatestActivities } from "./home/latest-activites";

export {
  UpcomingEvents,
  DealsChart,
  WinRateCard,
  TaskStageFlow,
  UpcomingEventsSkeleton,
  AccordionHeaderSkeleton,
  KanbanColumnSkeleton,
  ProjectCardSkeleton,
  LatestActivitiesSkeleton,
  DashboardTotalCountCard,
  LatestActivities,
};

export * from "./tags/user-tag";
export * from "./text";
export * from "./accordian";
export * from "./tasks/form/description";
export * from "./tasks/form/due-date";
export * from "./tasks/form/stage";
export * from "./tasks/form/title";
export * from "./tasks/form/users";
export * from "./tasks/form/header";
export * from "./tasks/form/contacts";
