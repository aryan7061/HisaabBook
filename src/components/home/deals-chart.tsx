import { DollarOutlined, WomanOutlined } from "@ant-design/icons";
import { useMemo } from "react";
import { Card } from "antd";
import { Text } from "../text";
import { Area, AreaConfig } from "@ant-design/plots";
import { useList } from "@refinedev/core";
import { DASHBOARD_DEALS_CHART_QUERY } from "@/graphql/queries";
import { GetFieldsFromList } from "@refinedev/nestjs-query";
import { DashboardDealsChartQuery } from "@/graphql/types";
import { mapDealsData, formatIndianCurrency } from "@/utilities/helpers";

export const DealsChart = () => {
  const { query } = useList<GetFieldsFromList<DashboardDealsChartQuery>>({
    resource: "dealStages",
    filters: [
      {
        field: "title",
        operator: "in",
        value: ["WON", "LOST"],
      },
    ],
    meta: {
      gqlQuery: DASHBOARD_DEALS_CHART_QUERY,
    },
  });

  const dealData = useMemo(() => {
    return mapDealsData(query.data?.data);
  }, [query.data?.data]);

  const config: AreaConfig = {
    data: dealData,
    xField: "timeText",
    yField: "value",
    colorField: "state",
    shapeField: "smooth",
    legend: {
      position: "top-right",
    },
    axis: {
      y: {
        labelFormatter: (v: number) => formatIndianCurrency(v),
      },
    },
    tooltip: {
      fields: ["state", "value"],
      formatter: (data: { state: string; value: number }) => ({
        name: data.state,
        value: formatIndianCurrency(data.value),
      }),
    },
  };

  return (
    <Card
      style={{ height: "100%" }}
      styles={{
        header: { padding: "8px 16px" },
        body: { padding: "24px 24px 0 24px" },
      }}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <DollarOutlined />
          <Text size="sm" style={{ marginLeft: "0.5rem" }}>
            Deals
          </Text>
        </div>
      }
    >
      <Area {...config} height={325} />
    </Card>
  );
};
