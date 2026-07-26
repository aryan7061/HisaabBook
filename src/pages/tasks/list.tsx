import { useMemo, useState } from "react";
import { KanbanColumnSkeleton, ProjectCardSkeleton } from "@/components";
import { KanbanAddCardButton } from "@/components/tasks/kanban/add-card-button";
import {
  KanbanBoard,
  KanbanBoardContainer,
} from "@/components/tasks/kanban/board";
import { ProjectCardMemo } from "@/components/tasks/kanban/card";
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
  useInvalidate,
  useList,
  useUpdate,
} from "@refinedev/core";
import { GetFieldsFromList } from "@refinedev/nestjs-query";
import { Button, DatePicker, Pagination, Select, Typography } from "antd";
import { PlusOutlined, TeamOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import React from "react";

type Identity = {
  id: string;
  email: string;
  name?: string;
};

type DateMode = "default" | "last7" | "last30" | "custom";
const PAGE_SIZE = 12;

// One column's own data fetch: independent filters + independent pagination,
// per the "per column, fully independent" spec. This is the structural
// change that pagination-per-column requires -- previously one fetch of all
// tasks was grouped client-side; now each visible column runs its own
// server-side paginated query.
const TaskStageColumn = ({
  stageId,
  title,
  color,
  dateFilter,
  scopeFilters,
  onAddClick,
}: {
  stageId: string | "unassigned";
  title: string;
  color: string;
  dateFilter: CrudFilter;
  scopeFilters: CrudFilter[];
  onAddClick: () => void;
}) => {
  const [page, setPage] = useState(1);

  const stageFilter: CrudFilter =
    stageId === "unassigned"
      ? { field: "stageId", operator: "null", value: true }
      : { field: "stageId", operator: "eq", value: stageId };

  const filters: CrudFilter[] = [...scopeFilters, stageFilter, dateFilter];

  const { query, result } = useList<GetFieldsFromList<TasksQuery>>({
    resource: "tasks",
    filters,
    sorters: [{ field: "dueDate", order: "asc" }],
    pagination: { mode: "server", currentPage: page, pageSize: PAGE_SIZE },
    meta: { gqlQuery: TASKS_QUERY },
  });

  // Explicit cast, same convention already used in deal/list.tsx
  // (`const deals = (tableProps.dataSource ?? []) as Deal[]`) -- the plain
  // `result.data ?? []` wasn't resolving to the concrete generic type here,
  // which is what caused `id` to type as `BaseKey | undefined` instead of
  // `string`, and the whole task shape to fall back to a generic default
  // missing `title`/`updatedAt`.
  const tasks = (result.data ?? []) as GetFieldsFromList<TasksQuery>[];
  const total = result.total ?? 0;

  return (
    <KanbanColumn
      id={stageId}
      title={title}
      color={color}
      count={total}
      onAddClick={onAddClick}
    >
      {query.isLoading ? (
        Array.from({ length: 4 }).map((_, i) => <ProjectCardSkeleton key={i} />)
      ) : (
        <>
          {tasks.map((task) => (
            <KanbanItem key={task.id} id={task.id} data={{ ...task, stageId }}>
              <ProjectCardMemo {...task} dueDate={task.dueDate || undefined} />
            </KanbanItem>
          ))}

          {!tasks.length && <KanbanAddCardButton onClick={onAddClick} />}

          {total > PAGE_SIZE && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "8px 0",
              }}
            >
              <Pagination
                size="small"
                current={page}
                pageSize={PAGE_SIZE}
                total={total}
                showSizeChanger={false}
                onChange={setPage}
              />
            </div>
          )}
        </>
      )}
    </KanbanColumn>
  );
};

export const List = ({ children }: React.PropsWithChildren) => {
  const go = useGo();
  const invalidate = useInvalidate();
  const [membersOpen, setMembersOpen] = useState(false);

  // Empty array = no stage filter active = show every column. Matches the
  // agreed multi-select behavior without a confusing "select nothing shows
  // nothing" trap.
  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  const [dateMode, setDateMode] = useState<DateMode>("default");
  const [customRange, setCustomRange] = useState<[string, string] | null>(null);

  const { data: identity } = useGetIdentity<Identity>();

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
    meta: { gqlQuery: TASK_STAGES_QUERY },
  });
  const isLoadingStages = stagesQuery.isLoading;

  const scopeFilters: CrudFilter[] =
    identity && !isDemoAccount(identity.email)
      ? [{ field: "createdBy.id", operator: "eq", value: identity.id }]
      : [];

  // Resolves the active date filter to a single CrudFilter object -- never
  // two separate gte/lte entries for the same field. @refinedev/nestjs-query's
  // generateFilters uses lodash.set(result, field, ...) internally, which
  // OVERWRITES rather than merges when two filters share the same field, so
  // sending both a gte and an lte entry for "createdAt" would silently drop
  // one of them (this is the root cause of the earlier "only lte survives"
  // bug on the Companies/Contacts date filter). Custom Range therefore uses
  // the single "between" operator instead -- verified against nestjs-query's
  // actual operatorMapper, which converts it to { between: { lower, upper } },
  // matching nestjs-query-graphql's CommonFieldComparisonBetweenType exactly.
  const dateFilter: CrudFilter = useMemo(() => {
    const now = dayjs();
    switch (dateMode) {
      case "last7":
        return {
          field: "createdAt",
          operator: "gte",
          value: now.subtract(7, "day").startOf("day").toISOString(),
        };
      case "last30":
        return {
          field: "createdAt",
          operator: "gte",
          value: now.subtract(30, "day").startOf("day").toISOString(),
        };
      case "custom":
        return customRange
          ? {
              field: "createdAt",
              operator: "between",
              value: [
                dayjs(customRange[0]).startOf("day").toISOString(),
                dayjs(customRange[1]).endOf("day").toISOString(),
              ],
            }
          : {
              field: "createdAt",
              operator: "gte",
              value: now.subtract(15, "day").startOf("day").toISOString(),
            };
      default:
        return {
          field: "createdAt",
          operator: "gte",
          value: now.subtract(15, "day").startOf("day").toISOString(),
        };
    }
  }, [dateMode, customRange]);

  const stageOptions = useMemo(
    () => [
      ...(stagesResult.data ?? []).map((s) => ({
        label: s.title,
        value: s.id,
      })),
      { label: "Unassigned", value: "unassigned" },
    ],
    [stagesResult.data],
  );

  const visibleColumns = useMemo(() => {
    const all = [
      { id: "unassigned", title: "unassigned", color: unassignedStageColor },
      ...(stagesResult.data ?? []).map((s) => ({
        id: s.id,
        title: s.title,
        color: getStageColor(s.title),
      })),
    ];
    if (selectedStages.length === 0) return all;
    return all.filter((c) => selectedStages.includes(c.id));
  }, [stagesResult.data, selectedStages]);

  const handleAddCard = (args: { stageId: string }) => {
    const path =
      args.stageId === "unassigned"
        ? "/tasks/new"
        : `/tasks/new?stageId=${args.stageId}`;
    go({ to: path, type: "replace" });
  };

  const { mutate: updateTask } = useUpdate();

  const handleOnDragEnd = (event: DragEndEvent) => {
    let stageId = event.over?.id as undefined | string | null;
    const taskId = event.active.id as string;
    const taskStageId = event.active.data.current?.stageId;

    if (taskStageId === stageId) return;

    if (stageId === "unassigned") {
      stageId = null;
    }
    updateTask(
      {
        resource: "tasks",
        id: taskId,
        values: { stageId },
        successNotification: false,
        mutationMode: "optimistic",
        meta: { gqlMutation: UPDATE_TASK_STAGE_MUTATION },
      },
      {
        // Each column now runs its OWN independent query (its own cache
        // entry, keyed by its own filters) rather than one shared query
        // grouped client-side. A single optimistic update to one task
        // record doesn't automatically update every column's separately
        // cached list -- this invalidation refetches every active "tasks"
        // list query (across all columns) so the moved card actually
        // disappears from its old column and appears in its new one.
        onSuccess: () => {
          invalidate({ resource: "tasks", invalidates: ["list"] });
        },
      },
    );
  };

  const isLoading = isLoadingStages;

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 32px 0",
          flexWrap: "wrap",
          gap: 12,
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <Select
            mode="multiple"
            allowClear
            placeholder="Filter by stage"
            style={{ minWidth: 220 }}
            options={stageOptions}
            value={selectedStages}
            onChange={setSelectedStages}
          />
          <Select
            placeholder="Filter by date"
            allowClear
            style={{ minWidth: 160 }}
            value={dateMode === "default" ? undefined : dateMode}
            onChange={(value) => setDateMode(value ?? "default")}
            options={[
              { label: "Last 7 Days", value: "last7" },
              { label: "Last 30 Days", value: "last30" },
              { label: "Custom Range", value: "custom" },
            ]}
          />
          {dateMode === "custom" && (
            <DatePicker.RangePicker
              onChange={(dates) => {
                if (dates && dates[0] && dates[1]) {
                  setCustomRange([
                    dates[0].toISOString(),
                    dates[1].toISOString(),
                  ]);
                } else {
                  setCustomRange(null);
                }
              }}
            />
          )}
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
            {visibleColumns.map((col) => (
              <TaskStageColumn
                key={col.id}
                stageId={col.id}
                title={col.title}
                color={col.color}
                dateFilter={dateFilter}
                scopeFilters={scopeFilters}
                onAddClick={() => handleAddCard({ stageId: col.id })}
              />
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
