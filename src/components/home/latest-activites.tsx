import { UnorderedListOutlined } from "@ant-design/icons";
import { Button, Card, List, Tag } from "antd";
import { Text } from "../text";
import LatestActivitiesSkeleton from "../skeleton/latest-activities";
import { useList } from "@refinedev/core";
import {
  DASHBOARD_LATEST_ACTIVITIES_AUDITS_QUERY,
  DASHBOARD_LATEST_ACTIVITIES_DEALS_QUERY,
} from "@/graphql/queries";
import CustomAvatar from "../custom-avatar";
import dayjs from "dayjs";
import { Audit, Deal } from "@/graphql/schema.types";
import { useState } from "react";

const PAGE_SIZE = 5;

export const LatestActivities = () => {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const { query: auditQuery } = useList<Audit>({
    resource: "audits",
    meta: {
      gqlQuery: DASHBOARD_LATEST_ACTIVITIES_AUDITS_QUERY,
    },
  });

  const dealIds = auditQuery.data?.data?.map((a) => String(a.targetId)) ?? [];

  const { query: dealsQuery } = useList<Deal>({
    resource: "deals",
    queryOptions: { enabled: !!dealIds.length },
    pagination: { mode: "off" },
    filters: [{ field: "id", operator: "in", value: dealIds }],
    meta: { gqlQuery: DASHBOARD_LATEST_ACTIVITIES_DEALS_QUERY },
  });

  if (auditQuery.isError) {
    console.error(auditQuery.error);
    return null;
  }

  const isLoading = auditQuery.isLoading || dealsQuery.isLoading;
  const allActivities = auditQuery.data?.data ?? [];
  const visibleActivities = allActivities.slice(0, visibleCount);
  const hasMore = visibleCount < allActivities.length;

  return (
    <Card
      styles={{ header: { padding: "16px" }, body: { padding: "0 1rem" } }}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <UnorderedListOutlined />
          <Text size="sm" style={{ marginLeft: "0.5rem" }}>
            Latest Activities
          </Text>
        </div>
      }
    >
      {isLoading ? (
        <List
          itemLayout="horizontal"
          dataSource={Array.from({ length: 5 }).map((_, index) => ({
            id: index,
          }))}
          renderItem={(_, index) => <LatestActivitiesSkeleton key={index} />}
        />
      ) : (
        <>
          <List
            itemLayout="horizontal"
            dataSource={visibleActivities}
            renderItem={(item: Audit) => {
              const deal = dealsQuery.data?.data?.find(
                (d) => d.id === String(item.targetId),
              );

              const isCreate = item.action === "CREATE";
              const actionText = isCreate ? "created" : "moved";
              const prepositionText = isCreate ? "in" : "to";

              return (
                <List.Item>
                  <List.Item.Meta
                    style={{ alignItems: "center" }}
                    avatar={
                      <CustomAvatar
                        shape="square"
                        size={48}
                        src={deal?.company?.avatarUrl ?? ""}
                        name={deal?.company?.name ?? ""}
                      />
                    }
                    title={
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <Text size="xs">
                          {dayjs(deal?.createdAt).format(
                            "MMM DD, YYYY - HH:mm",
                          )}
                        </Text>
                        {deal?.company?.name && (
                          <Text
                            size="xs"
                            style={{
                              color: "#8c8c8c",
                              borderLeft: "1px solid #d9d9d9",
                              paddingLeft: "8px",
                            }}
                          >
                            {deal.company.name}
                          </Text>
                        )}
                        {/* Action button next to company name */}
                        <Tag
                          color={isCreate ? "success" : "processing"}
                          style={{
                            marginLeft: "4px",
                            borderRadius: "12px",
                            fontSize: "11px",
                            padding: "0 8px",
                            lineHeight: "18px",
                            cursor: "default",
                          }}
                        >
                          {actionText}
                        </Tag>
                      </div>
                    }
                    description={
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                        }}
                      >
                        <Text strong style={{ flexShrink: 0 }}>
                          {item.user?.name ?? ""}
                        </Text>
                        <Text
                          ellipsis
                          strong
                          style={{ flexShrink: 1, minWidth: 0 }}
                        >
                          {deal?.title ?? ""}
                        </Text>
                        <Text style={{ flexShrink: 0 }}>
                          deal {prepositionText}
                        </Text>
                        <Text strong style={{ flexShrink: 0 }}>
                          {deal?.stage?.title ?? ""}
                        </Text>
                      </div>
                    }
                  />
                </List.Item>
              );
            }}
          />

          {hasMore && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "12px 0",
              }}
            >
              <Button
                type="link"
                onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
              >
                Load more
              </Button>
            </div>
          )}
        </>
      )}
    </Card>
  );
};
