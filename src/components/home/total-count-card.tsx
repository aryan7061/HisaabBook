import { totalCountVariants } from "@/constants";
import { Card, Skeleton } from "antd";
import { Text } from "../text";
import { Area } from "@ant-design/plots";

type Props = {
  resource: "companies" | "contacts" | "deals";
  isLoading: boolean;
  totalCount: number;
};

export const DashboardTotalCountCard = ({
  resource,
  isLoading,
  totalCount,
}: Props) => {
  const { primaryColor, secondaryColor, icon, title } =
    totalCountVariants[resource];

  const config = {
    data: totalCountVariants[resource].data,
    xField: "index",
    yField: "value",
    padding: 0,
    autoFit: false,
    width: 160,
    height: 50,
    tooltip: false,
    legend: false,
    axis: {
      x: false,
      y: false,
    },
    shapeField: "smooth",
    style: {
      fill: secondaryColor,
      fillOpacity: 0.6,
    },
    line: {
      style: {
        stroke: primaryColor,
        lineWidth: 1.5,
      },
    },
    scale: {
      y: {
        nice: true,
      },
    },
    interaction: {
      tooltip: false,
    },
  } as any;

  return (
    <Card
      className="hb-card hb-chart-gold"
      style={{ height: "96px", padding: 0, overflow: "hidden" }}
      styles={{
        body: {
          padding: "8px 8px 8px 12px",
          height: "100%",
          overflow: "hidden",
        },
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          whiteSpace: "nowrap",
        }}
      >
        {icon}
        <Text size="md" className="secondary" style={{ marginLeft: "8px" }}>
          {title}
        </Text>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "4px",
        }}
      >
        <Text
          size="xxxl"
          strong
          style={{
            flex: 1,
            whiteSpace: "nowrap",
            flexShrink: 0,
            textAlign: "start",
            marginLeft: "48px",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {isLoading ? (
            <Skeleton.Button
              style={{
                marginTop: "8px",
                width: "74px",
              }}
            />
          ) : (
            totalCount
          )}
        </Text>

        <div style={{ width: "160px", height: "50px", overflow: "hidden" }}>
          <Area {...config} />
        </div>
      </div>
    </Card>
  );
};
