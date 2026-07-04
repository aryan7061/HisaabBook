import { DollarOutlined, RiseOutlined, FallOutlined } from "@ant-design/icons";
import { useMemo, useState } from "react";
import { Card, Tag } from "antd";
import { Text } from "../text";
import { Area } from "@ant-design/plots";
import { useList } from "@refinedev/core";
import { DASHBOARD_DEALS_CHART_QUERY } from "@/graphql/queries";
import { GetFieldsFromList } from "@refinedev/nestjs-query";
import { DashboardDealsChartQuery } from "@/graphql/types";
import { mapDealsData, formatIndianCurrency } from "@/utilities/helpers";

export const DealsChart = () => {
  const [activeStates, setActiveStates] = useState<string[]>(["Won", "Lost"]);

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

  // Filter data based on active states
  const filteredData = useMemo(() => {
    return dealData.filter((d) => activeStates.includes(d.state));
  }, [dealData, activeStates]);

  const wonTotal = useMemo(() => {
    return dealData
      .filter((d) => d.state === "Won")
      .reduce((sum, d) => sum + d.value, 0);
  }, [dealData]);

  const lostTotal = useMemo(() => {
    return dealData
      .filter((d) => d.state === "Lost")
      .reduce((sum, d) => sum + d.value, 0);
  }, [dealData]);

  const toggleState = (state: string) => {
    setActiveStates((prev) => {
      // Prevent deselecting both
      if (prev.includes(state) && prev.length === 1) return prev;
      return prev.includes(state)
        ? prev.filter((s) => s !== state)
        : [...prev, state];
    });
  };

  const config = {
    data: filteredData,
    xField: "timeText",
    yField: "value",
    colorField: "state",
    shapeField: "smooth",
    scale: {
      color: {
        domain: ["Won", "Lost"],
        range: ["#52C41A", "#FF4D4F"],
      },
    },
    legend: false,
    axis: {
      x: {
        title: "Month",
        titleFontSize: 11,
        titleFill: "#8c8c8c",
        label: {
          style: {
            fill: "#8c8c8c",
            fontSize: 11,
          },
        },
      },
      y: {
        title: "Deal Value (₹)",
        titleFontSize: 11,
        titleFill: "#8c8c8c",
        labelFormatter: (v: number) => formatIndianCurrency(v),
        label: {
          style: {
            fill: "#8c8c8c",
            fontSize: 11,
          },
        },
      },
    },
    tooltip: {
      fields: ["state", "value"],
      formatter: (data: { state: string; value: number }) => ({
        name: data.state,
        value: formatIndianCurrency(data.value),
      }),
    },
  } as any;

  return (
    <Card
      style={{ height: "100%" }}
      styles={{
        header: { padding: "8px 16px" },
        body: { padding: "24px 24px 0 24px" },
      }}
      title={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <DollarOutlined />
            <Text size="sm" style={{ marginLeft: "0.5rem" }}>
              Deals Overview
            </Text>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Tag
              icon={<RiseOutlined />}
              color="success"
              style={{ margin: 0, fontWeight: 600 }}
            >
              Won: {formatIndianCurrency(wonTotal)}
            </Tag>
            <Tag
              icon={<FallOutlined />}
              color="error"
              style={{ margin: 0, fontWeight: 600 }}
            >
              Lost: {formatIndianCurrency(lostTotal)}
            </Tag>
          </div>
        </div>
      }
    >
      {/* Won/Lost toggle buttons */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
        <Tag
          color={activeStates.includes("Won") ? "#52C41A" : "#d9d9d9"}
          onClick={() => toggleState("Won")}
          style={{
            margin: 0,
            borderRadius: "12px",
            padding: "2px 10px",
            fontWeight: 500,
            fontSize: "12px",
            cursor: "pointer",
            opacity: activeStates.includes("Won") ? 1 : 0.5,
            transition: "all 0.2s",
          }}
        >
          ● Won
        </Tag>
        <Tag
          color={activeStates.includes("Lost") ? "#FF4D4F" : "#d9d9d9"}
          onClick={() => toggleState("Lost")}
          style={{
            margin: 0,
            borderRadius: "12px",
            padding: "2px 10px",
            fontWeight: 500,
            fontSize: "12px",
            cursor: "pointer",
            opacity: activeStates.includes("Lost") ? 1 : 0.5,
            transition: "all 0.2s",
          }}
        >
          ● Lost
        </Tag>
      </div>

      <Area {...config} height={295} />
    </Card>
  );
};
