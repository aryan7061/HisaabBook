import { useMemo, useState } from "react";
import { TrophyOutlined, DownloadOutlined } from "@ant-design/icons";
import { Button, Card, Skeleton } from "antd";
import { useCustom, useGetIdentity } from "@refinedev/core";
import ExcelJS from "exceljs";

import { Text } from "../text";
import { DASHBOARD_WIN_RATE_QUERY } from "@/graphql/queries";
import { DashboardWinRateQuery } from "@/graphql/types";
import { isDemoAccount } from "@/utilities/helpers";
import { IconWrapper } from "@/constants";

type Identity = {
  id: string;
  email: string;
};

const WON_COLOR = "#6B9B5E";
const LOST_COLOR = "#B36B6B";

export const WinRateCard = () => {
  const [exporting, setExporting] = useState(false);
  const [hoveredSegment, setHoveredSegment] = useState<"won" | "lost" | null>(
    null,
  );
  const { data: identity, isLoading: identityLoading } =
    useGetIdentity<Identity>();
  const isDemo = isDemoAccount(identity?.email);

  const { query } = useCustom<DashboardWinRateQuery>({
    url: "",
    method: "get",
    meta: {
      gqlQuery: DASHBOARD_WIN_RATE_QUERY,
      variables: {
        filter: { title: { in: ["WON", "LOST"] } },
        dealsAggregateFilter: isDemo
          ? undefined
          : { createdById: { eq: identity?.id } },
      },
    },
    queryOptions: { enabled: !!identity?.id },
  });

  const isLoading = identityLoading || query.isLoading;

  const { wonCount, lostCount } = useMemo(() => {
    const nodes = query.data?.data.dealStages.nodes ?? [];
    const won = nodes.find((n) => n.title === "WON");
    const lost = nodes.find((n) => n.title === "LOST");
    return {
      wonCount: won?.dealsAggregate?.[0]?.count?.id ?? 0,
      lostCount: lost?.dealsAggregate?.[0]?.count?.id ?? 0,
    };
  }, [query.data?.data]);

  const total = wonCount + lostCount;
  const winRate = total > 0 ? Math.round((wonCount / total) * 100) : 0;

  const r = 70;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * r;
  const wonLength = total > 0 ? (wonCount / total) * circumference : 0;

  const handleExport = async () => {
    setExporting(true);
    try {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Win Rate");
      sheet.columns = [
        { header: "Metric", key: "metric", width: 20 },
        { header: "Value", key: "value", width: 14 },
      ];
      sheet.addRow({ metric: "Won deals", value: wonCount });
      sheet.addRow({ metric: "Lost deals", value: lostCount });
      sheet.addRow({ metric: "Total closed", value: total });
      sheet.addRow({ metric: "Win rate (%)", value: winRate });
      sheet.getRow(1).font = { bold: true };

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "win-rate.xlsx";
      link.click();
      window.URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  return (
    <Card
      className="hb-card hb-chart-gold"
      style={{ height: "100%" }}
      styles={{
        header: { padding: "8px 16px" },
        body: {
          padding: "16px",
          height: "calc(100% - 57px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        },
      }}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <IconWrapper
            color="rgba(176, 141, 87, 0.15)"
            glow="rgba(176, 141, 87, 0.4)"
            shape="square"
          >
            <TrophyOutlined style={{ color: "#B08D57" }} />
          </IconWrapper>
          <Text size="sm" style={{ marginLeft: "0.5rem" }}>
            Win Rate
          </Text>
        </div>
      }
      extra={
        !isLoading && total > 0 ? (
          <Button
            size="small"
            shape="round"
            icon={<DownloadOutlined />}
            onClick={handleExport}
            loading={exporting}
            className="hb-btn-glossy-gold"
          >
            Export
          </Button>
        ) : null
      }
    >
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : total === 0 ? (
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
          <TrophyOutlined style={{ fontSize: "32px", color: "#4A4438" }} />
          <Text size="sm" style={{ color: "#9C9184" }}>
            No closed deals yet
          </Text>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
          }}
        >
          <div style={{ position: "relative" }}>
            <svg viewBox="0 0 180 180" style={{ width: 180, height: 180 }}>
              <defs>
                <filter
                  id="winRateTextGlow"
                  x="-100%"
                  y="-100%"
                  width="300%"
                  height="300%"
                >
                  <feGaussianBlur stdDeviation="7" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <circle
                cx="90"
                cy="90"
                r={r}
                fill="none"
                stroke="rgba(255,255,255,0.03)"
                strokeWidth={strokeWidth}
              />
              <circle
                cx="90"
                cy="90"
                r={r}
                fill="none"
                stroke={LOST_COLOR}
                strokeOpacity={0.25}
                strokeWidth={strokeWidth}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHoveredSegment("lost")}
                onMouseLeave={() => setHoveredSegment(null)}
              />
              <circle
                cx="90"
                cy="90"
                r={r}
                fill="none"
                stroke={WON_COLOR}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={`${wonLength} ${circumference}`}
                transform="rotate(-90 90 90)"
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHoveredSegment("won")}
                onMouseLeave={() => setHoveredSegment(null)}
              />
              <text
                x="90"
                y="86"
                textAnchor="middle"
                fontSize="32"
                fontWeight={700}
                fill="#F0E9DC"
                filter="url(#winRateTextGlow)"
              >
                {winRate}%
              </text>
              <text
                x="90"
                y="106"
                textAnchor="middle"
                fontSize="11"
                fill="#9C9184"
              >
                won all-time
              </text>
            </svg>
            {hoveredSegment && (
              <div
                className="hb-chart-tooltip"
                style={{
                  position: "absolute",
                  top: "38%",
                  left: "calc(100% + 8px)",
                  transform: "translateY(-50%)",
                  minWidth: 100,
                  whiteSpace: "nowrap",
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: hoveredSegment === "won" ? WON_COLOR : LOST_COLOR,
                    textShadow: `0 0 8px ${
                      hoveredSegment === "won" ? WON_COLOR : LOST_COLOR
                    }`,
                  }}
                >
                  {hoveredSegment === "won" ? "Won" : "Lost"}
                </div>
                <div
                  style={{ fontSize: 15, fontWeight: 700, color: "#F0E9DC" }}
                >
                  {hoveredSegment === "won" ? wonCount : lostCount} deals
                </div>
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <span
              style={{
                fontSize: 12,
                color: WON_COLOR,
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 6,
                textShadow: `0 0 6px ${WON_COLOR}`,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: WON_COLOR,
                  boxShadow: `0 0 6px ${WON_COLOR}`,
                  display: "inline-block",
                }}
              />
              Won ({wonCount})
            </span>
            <span
              style={{
                fontSize: 12,
                color: LOST_COLOR,
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 6,
                textShadow: `0 0 6px ${LOST_COLOR}`,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: LOST_COLOR,
                  boxShadow: `0 0 6px ${LOST_COLOR}`,
                  display: "inline-block",
                }}
              />
              Lost ({lostCount})
            </span>
          </div>
        </div>
      )}
    </Card>
  );
};
