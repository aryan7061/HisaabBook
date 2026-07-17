import { UnorderedListOutlined } from "@ant-design/icons";
import { Card, List } from "antd";
import { Text } from "../text";
import { useGetIdentity } from "@refinedev/core";
import { isDemoAccount } from "@/utilities/helpers";

type Identity = {
  id: string;
  email: string;
};

export const LatestActivities = () => {
  const { isLoading: identityLoading } = useGetIdentity<Identity>();

  // TEMP: Audit entity not built on backend yet — showing empty state
  // until that phase is done, instead of querying a field that doesn't exist.
  const isLoading = identityLoading;
  const allActivities: {
    id: string;
    action: string;
    targetId: string;
    user?: { name?: string };
  }[] = [];

  return (
    <Card
      style={{ height: "100%" }}
      styles={{ header: { padding: "16px" }, body: { padding: "0 1rem" } }}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <UnorderedListOutlined />
          <Text size="sm" style={{ marginLeft: "0.5rem" }}>
            Recent Activity
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
          renderItem={() => null}
        />
      ) : (
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
            style={{ fontSize: "32px", color: "#d9d9d9" }}
          />
          <Text size="sm" style={{ color: "#d9d9d9" }}>
            No Activity Yet
          </Text>
        </div>
      )}
    </Card>
  );
};
