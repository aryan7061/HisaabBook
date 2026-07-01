import { CalculatorOutlined } from "@ant-design/icons";
import { Badge, Card, List } from "antd";
import { useList } from "@refinedev/core";
import { Text } from "../text";
import UpcomingEventsSkeleton from "../skeleton/upcoming-events";
import { getDate } from "@/utilities/helpers";
import { DASHBOARD_CALENDAR_UPCOMING_EVENTS_QUERY } from "@/graphql/queries";
import type { Event } from "@/graphql/schema.types";

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

  return (
    <Card
      style={{ height: "100%" }}
      styles={{
        header: { padding: "8px 16px" },
        body: { padding: "0 1rem" },
      }}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <CalculatorOutlined />
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
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={eventsToShow}
          renderItem={(item) => {
            const renderDate = getDate(item.startDate, item.endDate);
            return (
              <List.Item>
                <List.Item.Meta
                  avatar={<Badge color={item.color} />}
                  title={<Text size="xs">{renderDate}</Text>}
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
      {!query.isLoading && eventsToShow.length === 0 && (
        <span
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "220px",
          }}
        >
          No Upcoming Events
        </span>
      )}
    </Card>
  );
};
