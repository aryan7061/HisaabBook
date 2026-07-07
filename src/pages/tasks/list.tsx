import {
  KanbanBoard,
  KanbanBoardContainer,
} from "@/components/tasks/kanban/board";
import { KanbanColumn } from "@/components/tasks/kanban/column";
import React from "react";

export const List = () => {
  return (
    <>
      <KanbanBoardContainer>
        <KanbanBoard>
          <KanbanColumn></KanbanColumn>

          <KanbanColumn></KanbanColumn>

          <KanbanColumn></KanbanColumn>
        </KanbanBoard>
      </KanbanBoardContainer>
    </>
  );
};
