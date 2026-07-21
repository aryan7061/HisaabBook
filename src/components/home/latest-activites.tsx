import { useMemo, useState } from "react";
import { UnorderedListOutlined } from "@ant-design/icons";
import { Card, Pagination, Tooltip } from "antd";
import { useCustom, useGetIdentity } from "@refinedev/core";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
import { IconWrapper } from "@/constants";

import { Text } from "../text";
import { DASHBOARD_RECENT_ACTIVITY_QUERY } from "@/graphql/queries";
import { DashboardRecentActivityQuery } from "@/graphql/types";
import { isDemoAccount } from "@/utilities/helpers";

dayjs.extend(relativeTime);
dayjs.extend(utc);

type Identity = {
  id: string;
  email: string;
};

type ActivityType = "company" | "contact" | "deal" | "task";

type Activity = {
  id: string;
  type: ActivityType;
  name: string;
  updatedAt: string;
  isNew: boolean;
};

const TYPE_META: Record<ActivityType, { label: string; color: string }> = {
  company: { label: "Company", color: "#C9B96A" },
  contact: { label: "Contact", color: "#B36B6B" },
  deal: { label: "Deal", color: "#6B9B5E" },
  task: { label: "Task", color: "#7A8FAD" },
};

const PAGE_SIZE = 5;
const FETCH_LIMIT = 20;

const isSameMoment = (a: string, b: string) =>
  Math.abs(dayjs.utc(a).diff(dayjs.utc(b), "second")) < 2;

export const LatestActivities = () => {
  const [page, setPage] = useState(1);
  const { data: identity, isLoading: identityLoading } =
    useGetIdentity<Identity>();
  const isDemo = isDemoAccount(identity?.email);

  const ownerFilter = isDemo ? {} : { createdBy: { id: { eq: identity?.id } } };
  const sorting = [{ field: "updatedAt", direction: "DESC" }];

  const { query } = useCustom<DashboardRecentActivityQuery>({
    url: "",
    method: "get",
    meta: {
      gqlQuery: DASHBOARD_RECENT_ACTIVITY_QUERY,
      variables: {
        companiesFilter: ownerFilter,
        contactsFilter: ownerFilter,
        dealsFilter: ownerFilter,
        tasksFilter: ownerFilter,
        companiesSorting: sorting,
        contactsSorting: sorting,
        dealsSorting: sorting,
        tasksSorting: sorting,
        paging: { limit: FETCH_LIMIT },
      },
    },
    queryOptions: { enabled: !!identity?.id },
  });

  const isLoading = identityLoading || query.isLoading;

  const activities: Activity[] = useMemo(() => {
    const data = query.data?.data;
    if (!data) return [];

    const companies: Activity[] = data.companies.nodes.map((c) => ({
      id: c.id,
      type: "company",
      name: c.name,
      updatedAt: c.updatedAt,
      isNew: isSameMoment(c.createdAt, c.updatedAt),
    }));
    const contacts: Activity[] = data.contacts.nodes.map((c) => ({
      id: c.id,
      type: "contact",
      name: c.name,
      updatedAt: c.updatedAt,
      isNew: isSameMoment(c.createdAt, c.updatedAt),
    }));
    const deals: Activity[] = data.deals.nodes.map((d) => ({
      id: d.id,
      type: "deal",
      name: d.title,
      updatedAt: d.updatedAt,
      isNew: isSameMoment(d.createdAt, d.updatedAt),
    }));
    const tasks: Activity[] = data.tasks.nodes.map((t) => ({
      id: t.id,
      type: "task",
      name: t.title,
      updatedAt: t.updatedAt,
      isNew: isSameMoment(t.createdAt, t.updatedAt),
    }));

    return [...companies, ...contacts, ...deals, ...tasks]
      .sort((a, b) => dayjs.utc(b.updatedAt).diff(dayjs.utc(a.updatedAt)))
      .slice(0, FETCH_LIMIT);
  }, [query.data?.data]);

  const paginated = activities.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <Card
      className="hb-card hb-chart-gold"
      style={{ height: "100%" }}
      styles={{ header: { padding: "16px" }, body: { padding: "0 1rem" } }}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <IconWrapper
            color="rgba(176, 141, 87, 0.15)"
            glow="rgba(176, 141, 87, 0.4)"
            shape="square"
          >
            <UnorderedListOutlined style={{ color: "#B08D57" }} />
          </IconWrapper>
          <Text size="sm" style={{ marginLeft: "0.5rem" }}>
            Recent Activity
          </Text>
        </div>
      }
      extra={
        !isLoading && activities.length > 0 ? (
          <Text size="xs" style={{ color: "#9C9184" }}>
            {activities.length} total
          </Text>
        ) : null
      }
    >
      {isLoading ? (
        <div
          style={{
            padding: "16px 0",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              style={{
                height: 56,
                background: "#221E18",
                borderRadius: 8,
              }}
            />
          ))}
        </div>
      ) : activities.length === 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "220px",
            gap: "12px",
          }}
        >
          <UnorderedListOutlined
            style={{ fontSize: "32px", color: "#4A4438" }}
          />
          <Text size="sm" style={{ color: "#9C9184" }}>
            No Activity Yet
          </Text>
        </div>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              padding: "12px 0",
            }}
          >
            {paginated.map((activity) => {
              const meta = TYPE_META[activity.type];
              const header = activity.isNew
                ? `New ${meta.label}`
                : `${meta.label} Updated`;
              const description = activity.isNew
                ? `${activity.name} added`
                : `${activity.name} updated`;

              return (
                <div
                  key={`${activity.type}-${activity.id}`}
                  style={{ display: "flex", gap: 10, alignItems: "flex-start" }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: meta.color,
                      boxShadow: `0 0 6px ${meta.color}88`,
                      marginTop: 6,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Text strong size="sm">
                      {header}
                    </Text>
                    <div>
                      <Text size="sm" ellipsis={{ tooltip: description }}>
                        {description}
                      </Text>
                    </div>
                    <Tooltip
                      title={dayjs
                        .utc(activity.updatedAt)
                        .local()
                        .format("MMM D, YYYY - h:mm A")}
                    >
                      <Text
                        size="xs"
                        style={{ color: "#9C9184", cursor: "default" }}
                      >
                        {dayjs.utc(activity.updatedAt).fromNow()}
                      </Text>
                    </Tooltip>
                  </div>
                </div>
              );
            })}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              borderTop: "1px solid rgba(176, 141, 87, 0.16)",
              marginTop: 12,
              paddingTop: 16,
              paddingBottom: 16,
            }}
          >
            <Pagination
              size="small"
              current={page}
              pageSize={PAGE_SIZE}
              total={activities.length}
              onChange={setPage}
              showSizeChanger={false}
            />
          </div>
        </>
      )}
    </Card>
  );
};
