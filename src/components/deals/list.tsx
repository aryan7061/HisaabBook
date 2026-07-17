import { KanbanColumnSkeleton, ProjectCardSkeleton } from "@/components";
import { KanbanAddCardButton } from "@/components/deals/kanban/add-card-button";
import {
  KanbanBoard,
  KanbanBoardContainer,
} from "@/components/deals/kanban/board";
import { DealCardMemo } from "@/components/deals/kanban/card";
import { KanbanColumn } from "@/components/deals/kanban/column";
import { KanbanItem } from "@/components/deals/kanban/item";
import { UPDATE_DEAL_STAGE_MUTATION } from "@/graphql/mutations";
import { DEAL_STAGES_QUERY, DEALS_QUERY } from "@/graphql/queries";
import { DealStagesQuery, DealsQuery } from "@/graphql/types";
import { isDemoAccount } from "@/utilities/helpers";
import { DragEndEvent } from "@dnd-kit/core";
import {
  CrudFilter,
  useGetIdentity,
  useGo,
  useList,
  useUpdate,
} from "@refinedev/core";
import { GetFieldsFromList } from "@refinedev/nestjs-query";
import React from "react";

type Identity = {
  id: string;
  email: string;
};

const DEAL_STAGE_TITLES = ["NEW LEAD", "NEGOTIATION", "WON", "LOST"];

export const List = ({ children }: React.PropsWithChildren) => {
  const go = useGo();
  const { data: identity } = useGetIdentity<Identity>();

  const { query: stagesQuery, result: stagesResult } = useList<
    GetFieldsFromList<DealStagesQuery>
  >({
    resource: "dealStages",
    filters: [{ field: "title", operator: "in", value: DEAL_STAGE_TITLES }],
    sorters: [{ field: "createdAt", order: "asc" }],
    meta: { gqlQuery: DEAL_STAGES_QUERY },
  });
  const isLoadingStages = stagesQuery.isLoading;

  const scopeFilters: CrudFilter[] =
    identity && !isDemoAccount(identity.email)
      ? [{ field: "dealOwnerId", operator: "eq", value: identity.id }]
      : [];

  const { query: dealsQuery, result: dealsResult } = useList<
    GetFieldsFromList<DealsQuery>
  >({
    resource: "deals",
    filters: scopeFilters,
    sorters: [{ field: "createdAt", order: "desc" }],
    queryOptions: { enabled: !!stagesResult.data && !!identity },
    pagination: { mode: "off" },
    meta: { gqlQuery: DEALS_QUERY },
  });
  const isLoadingDeals = dealsQuery.isLoading;

  const { mutate: updateDeal } = useUpdate();

  const dealStages = React.useMemo(() => {
    if (!dealsResult.data || !stagesResult.data) {
      return { unassignedStage: [], columns: [] };
    }

    const unassignedStage = dealsResult.data.filter(
      (deal) => deal.stageId === null,
    );

    const grouped = stagesResult.data.map((stage) => ({
      ...stage,
      deals: dealsResult.data.filter(
        (deal) => deal.stageId?.toString() === stage.id,
      ),
    }));

    return { unassignedStage, columns: grouped };
  }, [stagesResult.data, dealsResult.data]);

  const handleAddCard = (args: { stageId: string }) => {
    const path =
      args.stageId === "unassigned"
        ? "/deals/new"
        : `/deals/new?stageId=${args.stageId}`;
    go({ to: path, type: "replace" });
  };

  const handleOnDragEnd = (event: DragEndEvent) => {
    let stageId = event.over?.id as undefined | string | null;
    const dealId = event.active.id as string;
    const dealStageId = event.active.data.current?.stageId;

    if (dealStageId === stageId) return;
    if (stageId === "unassigned") stageId = null;

    updateDeal({
      resource: "deals",
      id: dealId,
      values: { stageId },
      successNotification: false,
      mutationMode: "optimistic",
      meta: { gqlMutation: UPDATE_DEAL_STAGE_MUTATION },
    });
  };

  const isLoading = isLoadingStages || isLoadingDeals;
  if (isLoading) return <PageSkeleton />;

  return (
    <>
      <KanbanBoardContainer>
        <KanbanBoard onDragEnd={handleOnDragEnd}>
          <KanbanColumn
            id="unassigned"
            title="unassigned"
            count={dealStages.unassignedStage.length || 0}
            onAddClick={() => handleAddCard({ stageId: "unassigned" })}
          >
            {dealStages.unassignedStage.map((deal) => (
              <KanbanItem
                key={deal.id}
                id={deal.id}
                data={{ ...deal, stageId: "unassigned" }}
              >
                <DealCardMemo {...deal} />
              </KanbanItem>
            ))}
            {!dealStages.unassignedStage.length && (
              <KanbanAddCardButton
                onClick={() => handleAddCard({ stageId: "unassigned" })}
              />
            )}
          </KanbanColumn>

          {dealStages.columns?.map((column) => (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              count={column.deals.length}
              onAddClick={() => handleAddCard({ stageId: column.id })}
            >
              {column.deals.map((deal) => (
                <KanbanItem key={deal.id} id={deal.id} data={deal}>
                  <DealCardMemo {...deal} />
                </KanbanItem>
              ))}
              {!column.deals.length && (
                <KanbanAddCardButton
                  onClick={() => handleAddCard({ stageId: column.id })}
                />
              )}
            </KanbanColumn>
          ))}
        </KanbanBoard>
      </KanbanBoardContainer>
      {children}
    </>
  );
};

const PageSkeleton = () => {
  const columnCount = 4;
  const itemCount = 3;
  return (
    <KanbanBoardContainer>
      {Array.from({ length: columnCount }).map((_, index) => (
        <KanbanColumnSkeleton key={index}>
          {Array.from({ length: itemCount }).map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </KanbanColumnSkeleton>
      ))}
    </KanbanBoardContainer>
  );
};
