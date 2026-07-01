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
    pagination: { pageSize: 5 },
    meta: {
      gqlQuery: DASHBOARD_CALENDAR_UPCOMING_EVENTS_QUERY,
    },
  });

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
          dataSource={query.data?.data || []}
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
    </Card>
  );
};
