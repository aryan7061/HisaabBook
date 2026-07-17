import { useState } from "react";
import { KanbanColumnSkeleton, ProjectCardSkeleton } from "@/components";
import { KanbanAddCardButton } from "@/components/tasks/kanban/add-card-button";
import {
  KanbanBoard,
  KanbanBoardContainer,
} from "@/components/tasks/kanban/board";
import { ProjectCard, ProjectCardMemo } from "@/components/tasks/kanban/card";
import { KanbanColumn } from "@/components/tasks/kanban/column";
import { KanbanItem } from "@/components/tasks/kanban/item";
import { TeamMembersModal } from "@/components/team-members-modal";
import { UPDATE_TASK_STAGE_MUTATION } from "@/graphql/mutations";
import {
  TASK_STAGES_QUERY,
  TASKS_QUERY,
  USERS_SELECT_QUERY,
} from "@/graphql/queries";
import { TaskStagesQuery, TasksQuery, UsersSelectQuery } from "@/graphql/types";
import { isDemoAccount } from "@/utilities/helpers";
import {
  getStageColor,
  unassignedStageColor,
} from "@/utilities/task-stage-colors";
import { DragEndEvent } from "@dnd-kit/core";
import {
  CrudFilter,
  useGetIdentity,
  useGo,
  useList,
  useUpdate,
} from "@refinedev/core";
import { GetFieldsFromList } from "@refinedev/nestjs-query";
import { Button, Typography } from "antd";
import { PlusOutlined, TeamOutlined } from "@ant-design/icons";
import React from "react";

type Identity = {
  id: string;
  email: string;
  name?: string;
};

export const List = ({ children }: React.PropsWithChildren) => {
  const go = useGo();
  const [membersOpen, setMembersOpen] = useState(false);

  const { data: identity } = useGetIdentity<Identity>();

  // Scoped to source = TASK_MEMBER — must match the same filter used
  // inside TeamMembersModal / MembersPanel, or this count won't match
  // what the modal actually shows.
  const { result: usersResult } = useList<GetFieldsFromList<UsersSelectQuery>>({
    resource: "users",
    pagination: { mode: "off" },
    filters: [{ field: "source", operator: "eq", value: "TASK_MEMBER" }],
    meta: { gqlQuery: USERS_SELECT_QUERY },
  });

  const { query: stagesQuery, result: stagesResult } = useList<
    GetFieldsFromList<TaskStagesQuery>
  >({
    resource: "taskStages",
    filters: [
      {
        field: "title",
        operator: "in",
        value: ["TODO", "IN PROGRESS", "IN REVIEW", "DONE"],
      },
    ],
    sorters: [{ field: "createdAt", order: "asc" }],
    meta: {
      gqlQuery: TASK_STAGES_QUERY,
    },
  });
  const isLoadingStages = stagesQuery.isLoading;

  const scopeFilters: CrudFilter[] =
    identity && !isDemoAccount(identity.email)
      ? [{ field: "createdBy.id", operator: "eq", value: identity.id }]
      : [];

  const { query: tasksQuery, result: tasksResult } = useList<
    GetFieldsFromList<TasksQuery>
  >({
    resource: "tasks",
    filters: scopeFilters,
    sorters: [{ field: "dueDate", order: "asc" }],
    queryOptions: {
      enabled: !!stagesResult.data && !!identity,
    },
    pagination: {
      mode: "off",
    },
    meta: {
      gqlQuery: TASKS_QUERY,
    },
  });
  const isLoadingTasks = tasksQuery.isLoading;

  const { mutate: updateTask } = useUpdate();

  const taskStages = React.useMemo(() => {
    if (!tasksResult.data || !stagesResult.data) {
      return {
        unassignedStage: [],
        columns: [],
      };
    }

    const unassignedStage = tasksResult.data.filter((task) => {
      return task.stageId === null;
    });

    const grouped = stagesResult.data.map((stage) => ({
      ...stage,
      tasks: tasksResult.data.filter((task) => {
        return task.stageId?.toString() === stage.id;
      }),
    }));

    return {
      unassignedStage,
      columns: grouped,
    };
  }, [stagesResult.data, tasksResult.data]);

  const handleAddCard = (args: { stageId: string }) => {
    const path =
      args.stageId === "unassigned"
        ? "/tasks/new"
        : `/tasks/new?stageId=${args.stageId}`;

    go({ to: path, type: "replace" });
  };

  const handleOnDragEnd = (event: DragEndEvent) => {
    let stageId = event.over?.id as undefined | string | null;
    const taskId = event.active.id as string;
    const taskStageId = event.active.data.current?.stageId;

    if (taskStageId === stageId) return;

    if (stageId === "unassigned") {
      stageId = null;
    }
    updateTask({
      resource: "tasks",
      id: taskId,
      values: {
        stageId: stageId,
      },
      successNotification: false,
      mutationMode: "optimistic",
      meta: {
        gqlMutation: UPDATE_TASK_STAGE_MUTATION,
      },
    });
  };

  const isLoading = isLoadingStages || isLoadingTasks;

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 32px 0",
        }}
      >
        <div>
          <Typography.Title level={4} style={{ margin: 0 }}>
            {identity?.name ? `Welcome back, ${identity.name}` : "Tasks"}
          </Typography.Title>
          <Typography.Text type="secondary">
            Here's your task board for today
          </Typography.Text>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Button icon={<TeamOutlined />} onClick={() => setMembersOpen(true)}>
            Members {usersResult.data?.length ?? 0}
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleAddCard({ stageId: "unassigned" })}
          >
            New task
          </Button>
        </div>
      </div>

      {isLoading ? (
        <PageSkeleton />
      ) : (
        <KanbanBoardContainer>
          <KanbanBoard onDragEnd={handleOnDragEnd}>
            <KanbanColumn
              id="unassigned"
              title={"unassigned"}
              color={unassignedStageColor}
              count={taskStages.unassignedStage.length || 0}
              onAddClick={() => handleAddCard({ stageId: "unassigned" })}
            >
              {taskStages.unassignedStage.map((task) => (
                <KanbanItem
                  key={task.id}
                  id={task.id}
                  data={{ ...task, stageId: "unassigned" }}
                >
                  <ProjectCardMemo
                    {...task}
                    dueDate={task.dueDate || undefined}
                  />
                </KanbanItem>
              ))}

              {!taskStages.unassignedStage.length && (
                <KanbanAddCardButton
                  onClick={() => handleAddCard({ stageId: "unassigned" })}
                />
              )}
            </KanbanColumn>

            {taskStages.columns?.map((column) => (
              <KanbanColumn
                key={column.id}
                id={column.id}
                title={column.title}
                color={getStageColor(column.title)}
                count={column.tasks.length}
                onAddClick={() => handleAddCard({ stageId: column.id })}
              >
                {column.tasks.map((task) => (
                  <KanbanItem key={task.id} id={task.id} data={task}>
                    <ProjectCardMemo
                      {...task}
                      dueDate={task.dueDate || undefined}
                    />
                  </KanbanItem>
                ))}
                {!column.tasks.length && (
                  <KanbanAddCardButton
                    onClick={() => handleAddCard({ stageId: column.id })}
                  />
                )}
              </KanbanColumn>
            ))}
          </KanbanBoard>
        </KanbanBoardContainer>
      )}

      <TeamMembersModal
        open={membersOpen}
        onClose={() => setMembersOpen(false)}
      />

      {children}
    </>
  );
};

const PageSkeleton = () => {
  const columnCount = 6;
  const itemCount = 4;

  return (
    <KanbanBoardContainer>
      {Array.from({ length: columnCount }).map((_, index) => (
        <KanbanColumnSkeleton key={index}>
          {Array.from({ length: itemCount }).map((_, index) => (
            <ProjectCardSkeleton key={index} />
          ))}
        </KanbanColumnSkeleton>
      ))}
    </KanbanBoardContainer>
  );
};
