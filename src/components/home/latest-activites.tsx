import { UnorderedListOutlined } from "@ant-design/icons";
import { Button, Card, List, Tag } from "antd";
import { Text } from "../text";
import LatestActivitiesSkeleton from "../skeleton/latest-activities";
import { useCustom, useGetIdentity } from "@refinedev/core";
import {
  DASHBOARD_LATEST_ACTIVITIES_AUDITS_QUERY,
  DASHBOARD_LATEST_ACTIVITIES_DEALS_QUERY,
} from "@/graphql/queries";
import {
  DashboardLatestActivitiesAuditsQuery,
  DashboardLatestActivitiesDealsQuery,
} from "@/graphql/types";
import { isDemoAccount } from "@/utilities/helpers";
import CustomAvatar from "../custom-avatar";
import dayjs from "dayjs";
import { useState } from "react";

const PAGE_SIZE = 5;

type Identity = {
  id: string;
  email: string;
};

export const LatestActivities = () => {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const { data: identity, isLoading: identityLoading } =
    useGetIdentity<Identity>();

  const isDemo = isDemoAccount(identity?.email);

  const { query: auditQuery } = useCustom<DashboardLatestActivitiesAuditsQuery>(
    {
      url: "",
      method: "get",
      meta: {
        gqlQuery: DASHBOARD_LATEST_ACTIVITIES_AUDITS_QUERY,
        variables: {
          filter: isDemo ? {} : { user: { id: { eq: identity?.id } } },
        },
      },
      queryOptions: {
        enabled: !!identity?.id,
      },
    },
  );

  const dealIds =
    auditQuery.data?.data.audits.nodes.map((a) => String(a.targetId)) ?? [];

  const { query: dealsQuery } = useCustom<DashboardLatestActivitiesDealsQuery>({
    url: "",
    method: "get",
    meta: {
      gqlQuery: DASHBOARD_LATEST_ACTIVITIES_DEALS_QUERY,
      variables: {
        filter: { id: { in: dealIds } },
      },
    },
    queryOptions: {
      enabled: !!dealIds.length,
    },
  });

  if (auditQuery.isError) {
    console.error(auditQuery.error);
    return null;
  }

  const isLoading =
    identityLoading || auditQuery.isLoading || dealsQuery.isLoading;
  const allActivities = auditQuery.data?.data.audits.nodes ?? [];
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
      ) : allActivities.length === 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "160px",
            gap: "12px",
          }}
        >
          <UnorderedListOutlined
            style={{ fontSize: "32px", color: "#d9d9d9" }}
          />
          <Text size="sm" style={{ color: "#d9d9d9" }}>
            No Activity Yet
          </Text>
        </div>
      ) : (
        <>
          <List
            itemLayout="horizontal"
            dataSource={visibleActivities}
            renderItem={(item) => {
              const deal = dealsQuery.data?.data.deals.nodes.find(
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
