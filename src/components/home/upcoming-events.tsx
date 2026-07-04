import { CalendarOutlined } from "@ant-design/icons";
import { Badge, Card, List, Tag } from "antd";
import { useList } from "@refinedev/core";
import { Text } from "../text";
import UpcomingEventsSkeleton from "../skeleton/upcoming-events";
import { getDate } from "@/utilities/helpers";
import { DASHBOARD_CALENDAR_UPCOMING_EVENTS_QUERY } from "@/graphql/queries";
import type { Event } from "@/graphql/schema.types";
import dayjs from "dayjs";

export const UpcomingEvents = () => {
  const { query } = useList<Event>({
    resource: "events",
    pagination: { pageSize: 10 },
    meta: {
      gqlQuery: DASHBOARD_CALENDAR_UPCOMING_EVENTS_QUERY,
      variables: {
        filter: {},
        sorting: [{ field: "startDate", direction: "ASC" }],
        paging: { limit: 10, offset: 0 },
      },
    },
  });

  const now = new Date();
  const allEvents = query.data?.data || [];
  const upcomingEvents = allEvents.filter(
    (item) => new Date(item.endDate) >= now,
  );
  const eventsToShow =
    upcomingEvents.length > 0
      ? upcomingEvents.slice(0, 5)
      : allEvents.slice(0, 5);

  const isToday = (date: string) => dayjs(date).isSame(dayjs(), "day");

  return (
    <Card
      style={{ height: "100%" }}
      styles={{
        header: { padding: "8px 16px" },
        body: { padding: "0 1rem" },
      }}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <CalendarOutlined />
          <Text size="sm" style={{ marginLeft: "0.7rem" }}>
            Upcoming Events
          </Text>
        </div>
      }
    >
      {query.isLoading ? (
        <List
          itemLayout="horizontal"
          dataSource={Array.from({ length: 5 }).map((_, index) => ({
            id: index,
          }))}
          renderItem={() => <UpcomingEventsSkeleton />}
        />
      ) : eventsToShow.length === 0 ? (
        // Enhancement 3 — Better empty state
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
          <CalendarOutlined style={{ fontSize: "32px", color: "#d9d9d9" }} />
          <Text size="sm" style={{ color: "#d9d9d9" }}>
            No Upcoming Events
          </Text>
        </div>
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={eventsToShow}
          renderItem={(item) => {
            const renderDate = getDate(item.startDate, item.endDate);
            const today = isToday(item.startDate);

            return (
              // Enhancement 1 — Color coded left border
              <List.Item
                style={{
                  borderLeft: `4px solid ${item.color ?? "#d9d9d9"}`,
                  paddingLeft: "12px",
                  marginBottom: "8px",
                  borderRadius: "4px",
                }}
              >
                <List.Item.Meta
                  avatar={<Badge color={item.color} />}
                  title={
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <Text size="xs">{renderDate}</Text>
                      {/* Enhancement 2 — Today badge */}
                      {today && (
                        <Tag
                          color="blue"
                          style={{
                            fontSize: "10px",
                            padding: "0 4px",
                            lineHeight: "16px",
                          }}
                        >
                          Today
                        </Tag>
                      )}
                    </div>
                  }
                  description={
                    <Text ellipsis={{ tooltip: true }} strong>
                      {item.title}
                    </Text>
                  }
                />
              </List.Item>
            );
          }}
        />
      )}
    </Card>
  );
};
