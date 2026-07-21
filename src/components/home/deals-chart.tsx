import {
  DollarOutlined,
  RiseOutlined,
  FallOutlined,
  DownloadOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import { useEffect, useMemo, useState } from "react";
import { Button, Card, Segmented, Skeleton, Tag } from "antd";
import { Text } from "../text";
import { Area } from "@ant-design/plots";
import { useCustom, useGetIdentity } from "@refinedev/core";
import { DASHBOARD_DEALS_CHART_QUERY } from "@/graphql/queries";
import { DashboardDealsChartQuery } from "@/graphql/types";
import {
  mapDealsData,
  formatIndianCurrency,
  isDemoAccount,
} from "@/utilities/helpers";
import { IconWrapper } from "@/constants";
import ExcelJS from "exceljs";

type Identity = {
  id: string;
  email: string;
};

type Currency = "INR" | "USD";
type DateRange = "all" | "30d" | "2mo" | "6mo";

const DATE_RANGE_DAYS: Partial<Record<DateRange, number>> = {
  "30d": 30,
  "2mo": 60,
  "6mo": 182,
};

const FX_API_URL = "https://api.frankfurter.dev/v1/latest?base=INR&symbols=USD";

const WON_COLOR = "#7FA872";
const LOST_COLOR = "#C97A6D";

export const DealsChart = () => {
  const [activeStates, setActiveStates] = useState<string[]>(["Won", "Lost"]);
  const [currency, setCurrency] = useState<Currency>("INR");
  const [dateRange, setDateRange] = useState<DateRange>("all");
  const [usdRate, setUsdRate] = useState<number | null>(null);
  const [rateError, setRateError] = useState(false);
  const [exporting, setExporting] = useState(false);

  const { data: identity, isLoading: identityLoading } =
    useGetIdentity<Identity>();

  const isDemo = isDemoAccount(identity?.email);

  useEffect(() => {
    let cancelled = false;

    fetch(FX_API_URL)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data?.rates?.USD) {
          setUsdRate(data.rates.USD);
        }
      })
      .catch(() => {
        if (!cancelled) setRateError(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const { query } = useCustom<DashboardDealsChartQuery>({
    url: "",
    method: "get",
    meta: {
      gqlQuery: DASHBOARD_DEALS_CHART_QUERY,
      variables: {
        filter: { title: { in: ["WON", "LOST"] } },
        dealsAggregateFilter: isDemo
          ? undefined
          : { createdById: { eq: identity?.id } },
      },
    },
    queryOptions: {
      enabled: !!identity?.id,
    },
  });

  const isLoading = identityLoading || query.isLoading;

  const allDealData = useMemo(() => {
    return mapDealsData(query.data?.data.dealStages.nodes);
  }, [query.data?.data]);

  const rangeFilteredData = useMemo(() => {
    if (dateRange === "all") return allDealData;

    const days = DATE_RANGE_DAYS[dateRange] ?? 0;
    const cutoff = Date.now() / 1000 - days * 86400;
    return allDealData.filter((d) => d.timeUnix >= cutoff);
  }, [allDealData, dateRange]);

  const filteredData = useMemo(() => {
    return rangeFilteredData.filter((d) => activeStates.includes(d.state));
  }, [rangeFilteredData, activeStates]);

  const formatCurrency = (value: number): string => {
    if (currency === "USD" && usdRate) {
      const usdValue = value * usdRate;
      if (usdValue >= 1000000) return `$${(usdValue / 1000000).toFixed(2)}M`;
      if (usdValue >= 1000) return `$${(usdValue / 1000).toFixed(2)}K`;
      return `$${usdValue.toFixed(2)}`;
    }
    return formatIndianCurrency(value);
  };

  const wonTotal = useMemo(() => {
    return rangeFilteredData
      .filter((d) => d.state === "Won")
      .reduce((sum, d) => sum + d.value, 0);
  }, [rangeFilteredData]);

  const lostTotal = useMemo(() => {
    return rangeFilteredData
      .filter((d) => d.state === "Lost")
      .reduce((sum, d) => sum + d.value, 0);
  }, [rangeFilteredData]);

  const toggleState = (state: string) => {
    setActiveStates((prev) => {
      if (prev.includes(state) && prev.length === 1) return prev;
      return prev.includes(state)
        ? prev.filter((s) => s !== state)
        : [...prev, state];
    });
  };

  const buildSheet = (
    workbook: ExcelJS.Workbook,
    sheetName: string,
    data: typeof allDealData,
  ) => {
    const sheet = workbook.addWorksheet(sheetName);

    sheet.columns = [
      { header: "Month", key: "month", width: 14 },
      { header: "State", key: "state", width: 10 },
      { header: "Value (INR)", key: "valueInr", width: 16 },
      { header: "Value (USD)", key: "valueUsd", width: 16 },
    ];

    data.forEach((d) => {
      sheet.addRow({
        month: d.timeText,
        state: d.state,
        valueInr: d.value,
        valueUsd: usdRate ? Number((d.value * usdRate).toFixed(2)) : "",
      });
    });

    const won = data
      .filter((d) => d.state === "Won")
      .reduce((sum, d) => sum + d.value, 0);
    const lost = data
      .filter((d) => d.state === "Lost")
      .reduce((sum, d) => sum + d.value, 0);

    sheet.addRow({});
    sheet.addRow({
      month: "TOTAL",
      state: "Won",
      valueInr: won,
      valueUsd: usdRate ? Number((won * usdRate).toFixed(2)) : "",
    });
    sheet.addRow({
      month: "TOTAL",
      state: "Lost",
      valueInr: lost,
      valueUsd: usdRate ? Number((lost * usdRate).toFixed(2)) : "",
    });

    sheet.getRow(1).font = { bold: true };
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const workbook = new ExcelJS.Workbook();

      buildSheet(workbook, "Filtered View", rangeFilteredData);
      buildSheet(workbook, "All Data", allDealData);

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "deals-overview.xlsx";
      link.click();
      window.URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  const config = {
    data: filteredData,
    xField: "timeText",
    yField: "value",
    colorField: "state",
    shapeField: "smooth",
    isStack: false,
    style: {
      fill: (datum: { state: string }) =>
        datum.state === "Won"
          ? "l(90) 0:rgba(127,168,114,0.35) 1:rgba(127,168,114,0)"
          : "l(90) 0:rgba(201,122,109,0.35) 1:rgba(201,122,109,0)",
    },
    line: {
      style: {
        lineWidth: 3,
      },
    },
    point: {
      shapeField: "circle",
      style: {
        fill: (datum: { state: string }) =>
          datum.state === "Won" ? WON_COLOR : LOST_COLOR,
        stroke: "rgba(240,233,220,0.35)",
        lineWidth: 2,
        r: 4,
      },
    },
    scale: {
      color: {
        domain: ["Lost", "Won"],
        range: [LOST_COLOR, WON_COLOR],
      },
    },
    legend: false,
    axis: {
      x: {
        title: "Month",
        titleFontSize: 13,
        titleFill: "#B7A77C",
        labelFill: "#B7A77C",
        labelFontSize: 12,
        labelAutoRotate: false,
        labelAutoHide: false,
        line: {
          style: { stroke: "rgba(176,141,87,0.15)" },
        },
        tick: {
          style: { stroke: "rgba(176,141,87,0.15)" },
        },
        grid: false,
      },
      y: {
        title: `Deal Value (${currency === "USD" ? "$" : "₹"})`,
        titleFontSize: 13,
        titleFill: "#B7A77C",
        labelFormatter: (v: number) => formatCurrency(Number(v)),
        labelFill: "#B7A77C",
        labelFontSize: 12,
        line: false,
        tick: {
          style: { stroke: "rgba(176,141,87,0.15)" },
        },
        grid: {
          style: {
            stroke: "rgba(255,255,255,0.05)",
            lineDash: [4, 4],
          },
        },
      },
    },
    interaction: {
      tooltip: {
        render: (
          _event: unknown,
          {
            title,
            items,
          }: {
            title: string;
            items: { name: string; value: number; color: string }[];
          },
        ) => {
          return `
            <div style="padding: 12px 16px; background: #262517; border: 1px solid rgba(176,141,87,0.25); border-radius: 16px; box-shadow: 0 12px 35px rgba(0,0,0,0.45); color: #F0E9DC; font-size: 14px;">
              <div style="font-weight: 600; color: #C9A868; margin-bottom: 8px;">${title}</div>
              ${items
                .map(
                  (item) => `
                    <div style="display:flex; align-items:center; justify-content:space-between; gap:16px; margin-bottom:4px;">
                      <span style="display:flex; align-items:center; gap:6px; color:#B7A77C;">
                        <span style="width:7px;height:7px;border-radius:50%;background:${item.color};box-shadow:0 0 3px ${item.color};display:inline-block;"></span>
                        ${item.name}
                      </span>
                      <span style="font-weight:700; color:#F0E9DC;">${formatCurrency(item.value)}</span>
                    </div>
                  `,
                )
                .join("")}
            </div>
          `;
        },
        crosshairsLine: {
          style: {
            stroke: "rgba(176,141,87,0.25)",
            lineWidth: 1,
            lineDash: [4, 4],
          },
        },
      },
    },
  } as any;

  return (
    <Card
      className="hb-card hb-chart-gold"
      style={{ height: "auto" }}
      styles={{
        header: { padding: "12px 16px" },
        body: { padding: "24px 24px 24px 24px" },
      }}
      title={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <IconWrapper
              color="rgba(176, 141, 87, 0.12)"
              glow="rgba(176, 141, 87, 0.35)"
              shape="square"
            >
              <DollarOutlined style={{ color: "#B08D57" }} />
            </IconWrapper>
            <Text style={{ fontSize: 20, fontWeight: 600, color: "#F0E9DC" }}>
              Deals Overview
            </Text>
          </div>

          {!isLoading && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Tag
                icon={<RiseOutlined />}
                className="hb-kpi-pill hb-kpi-pill-won"
              >
                Won: {formatCurrency(wonTotal)}
              </Tag>
              <Tag
                icon={<FallOutlined />}
                className="hb-kpi-pill hb-kpi-pill-lost"
              >
                Lost: {formatCurrency(lostTotal)}
              </Tag>
              <Button
                shape="round"
                icon={<SwapOutlined />}
                onClick={() =>
                  setCurrency((prev) => (prev === "INR" ? "USD" : "INR"))
                }
                disabled={!usdRate && !rateError}
                className="hb-btn-glossy-gold"
              >
                {currency === "INR" ? "Change to Dollar" : "Change to Rupee"}
              </Button>
              <Button
                shape="round"
                icon={<DownloadOutlined />}
                onClick={handleExport}
                loading={exporting}
                className="hb-btn-glossy-gold"
              >
                Export
              </Button>
            </div>
          )}
        </div>
      }
    >
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : allDealData.length === 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "295px",
            gap: "12px",
          }}
        >
          <DollarOutlined style={{ fontSize: "32px", color: "#4A4438" }} />
          <Text size="sm" style={{ color: "#9C9184" }}>
            No Deals Yet
          </Text>
        </div>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", gap: "10px" }}>
              <Tag
                className="hb-legend-pill"
                color={activeStates.includes("Won") ? WON_COLOR : "#4A4438"}
                onClick={() => toggleState("Won")}
                style={{
                  margin: 0,
                  cursor: "pointer",
                  color: "#F0E9DC",
                  opacity: activeStates.includes("Won") ? 1 : 0.5,
                  transition: "all 0.2s",
                }}
              >
                ● Won
              </Tag>
              <Tag
                className="hb-legend-pill"
                color={activeStates.includes("Lost") ? LOST_COLOR : "#4A4438"}
                onClick={() => toggleState("Lost")}
                style={{
                  margin: 0,
                  cursor: "pointer",
                  color: "#F0E9DC",
                  opacity: activeStates.includes("Lost") ? 1 : 0.5,
                  transition: "all 0.2s",
                }}
              >
                ● Lost
              </Tag>
            </div>

            <div className="hb-segment-capsule">
              <Segmented
                size="small"
                value={dateRange}
                onChange={(value) => setDateRange(value as DateRange)}
                options={[
                  { label: "All Time", value: "all" },
                  { label: "30 Days", value: "30d" },
                  { label: "Last 2 Months", value: "2mo" },
                  { label: "Last 6 Months", value: "6mo" },
                ]}
              />
            </div>
          </div>

          <div className="hb-chart-plot-box">
            <Area {...config} height={400} />
          </div>
        </>
      )}
    </Card>
  );
};
