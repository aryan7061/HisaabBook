import { useEffect, useMemo, useRef, useState } from "react";
import { NodeIndexOutlined, DownloadOutlined } from "@ant-design/icons";
import { Button, Card, Skeleton } from "antd";
import { useCustom, useGetIdentity } from "@refinedev/core";
import dayjs from "dayjs";
import ExcelJS from "exceljs";

import { Text } from "../text";
import { IconWrapper } from "@/constants";
import { DASHBOARD_TASKS_BY_STAGE_QUERY } from "@/graphql/queries";
import { DashboardTasksByStageQuery } from "@/graphql/types";
import { isDemoAccount } from "@/utilities/helpers";
import {
  taskStageColors,
  unassignedStageColor,
} from "@/utilities/task-stage-colors";

type Identity = {
  id: string;
  email: string;
};

const STAGE_ORDER = ["TODO", "IN PROGRESS", "IN REVIEW", "DONE", "Unassigned"];
const TOOLTIP_ORDER = [...STAGE_ORDER].reverse();

const stageColor = (stage: string) =>
  stage === "Unassigned"
    ? unassignedStageColor
    : (taskStageColors[stage] ?? "#B8A888");

// Picks a "nice" round step (1/2/5/10 x a power of 10) for axis ticks,
// aiming for roughly `targetTicks` intervals across the given max value.
const niceStep = (max: number, targetTicks = 4) => {
  if (max <= 0) return 1;
  const raw = max / targetTicks;
  const magnitude = Math.pow(10, Math.floor(Math.log10(raw)));
  const normalized = raw / magnitude;
  let step: number;
  if (normalized < 1.5) step = 1;
  else if (normalized < 3) step = 2;
  else if (normalized < 7) step = 5;
  else step = 10;
  return step * magnitude;
};

// Minimum visual thickness given to a stage's "faded tail" when it has zero
// tasks in a given month, so ribbons taper into a visible colored band
// instead of collapsing to an invisible hairline point.
const RIBBON_TAPER = 8;

type Segment = { top: number; bottom: number; rx: number; hasBox: boolean };

type MonthBucket = {
  key: string;
  label: string;
  counts: Record<string, number>;
  total: number;
};

export const TaskStageFlow = () => {
  const [exporting, setExporting] = useState(false);
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);
  const [displayMonth, setDisplayMonth] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(700);
  const [containerHeight, setContainerHeight] = useState(360);
  const { data: identity, isLoading: identityLoading } =
    useGetIdentity<Identity>();
  const isDemo = isDemoAccount(identity?.email);

  // Keep showing the last-hovered month's data/position while fading out,
  // instead of snapping the tooltip's content away the instant the mouse
  // leaves a column -- this is what lets the fade/slide transition below
  // actually look smooth rather than popping.
  useEffect(() => {
    if (hoveredMonth) setDisplayMonth(hoveredMonth);
  }, [hoveredMonth]);

  // Measure the actual rendered width of the chart's container so the SVG's
  // internal column spacing can be recomputed to match it exactly -- this is
  // what prevents the browser's default "meet" scaling from shrinking/
  // letterboxing the chart when the card is wider than the SVG's native
  // viewBox width.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0]?.contentRect ?? {};
      if (width) setContainerWidth(width);
      if (height) setContainerHeight(height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { query } = useCustom<DashboardTasksByStageQuery>({
    url: "",
    method: "get",
    meta: {
      gqlQuery: DASHBOARD_TASKS_BY_STAGE_QUERY,
      variables: {
        filter: isDemo ? {} : { createdBy: { id: { eq: identity?.id } } },
        paging: { limit: 1000 },
      },
    },
    queryOptions: { enabled: !!identity?.id },
  });

  const isLoading = identityLoading || query.isLoading;

  const months: MonthBucket[] = useMemo(() => {
    const tasks = query.data?.data.tasks.nodes ?? [];
    const byMonth = new Map<string, MonthBucket>();

    tasks.forEach((t) => {
      const date = dayjs(t.createdAt);
      const key = date.format("YYYY-MM");
      const label = date.format("MMM YYYY");
      const stage = t.stage?.title ?? "Unassigned";

      if (!byMonth.has(key)) {
        byMonth.set(key, { key, label, counts: {}, total: 0 });
      }
      const bucket = byMonth.get(key)!;
      bucket.counts[stage] = (bucket.counts[stage] ?? 0) + 1;
      bucket.total += 1;
    });

    return Array.from(byMonth.values()).sort((a, b) =>
      a.key.localeCompare(b.key),
    );
  }, [query.data?.data]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Tasks by Stage");
      sheet.columns = [
        { header: "Month", key: "month", width: 14 },
        ...STAGE_ORDER.map((s) => ({ header: s, key: s, width: 14 })),
        { header: "Total", key: "total", width: 10 },
      ];
      months.forEach((m) => {
        const row: Record<string, string | number> = { month: m.label };
        STAGE_ORDER.forEach((s) => {
          row[s] = m.counts[s] ?? 0;
        });
        row.total = m.total;
        sheet.addRow(row);
      });
      sheet.getRow(1).font = { bold: true };

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "tasks-by-stage.xlsx";
      link.click();
      window.URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  const legendHeight = 40;
  const chartBottom = Math.max(180, containerHeight - legendHeight - 40);
  const chartHeight = chartBottom - 40;
  const colWidth = 70;
  const segGap = 10;
  const leftMargin = 54;
  const rightPad = 20;
  const minColSpacing = 110;
  const svgTotalHeight = chartBottom + 70;

  const n = months.length;
  const availableForSpacing = containerWidth - leftMargin - colWidth - rightPad;
  const colSpacing =
    n > 1
      ? Math.max(minColSpacing, availableForSpacing / (n - 1))
      : Math.max(minColSpacing, availableForSpacing);

  const maxTotal = Math.max(1, ...months.map((m) => m.total));

  const yStep = niceStep(maxTotal);
  const yTicks: number[] = [];
  for (let v = 0; v <= maxTotal; v += yStep) yTicks.push(v);
  if (yTicks[yTicks.length - 1] < maxTotal) {
    yTicks.push(yTicks[yTicks.length - 1] + yStep);
  }
  // Scale against the rounded top tick, not the raw max -- otherwise a tick
  // like "100" generated above the actual max of 85 maps to a y-position
  // past the SVG's top edge (since 100/85 > 1), clipping its own label.
  const niceMax = yTicks[yTicks.length - 1];
  const yToPixel = (v: number) => chartBottom - (v / niceMax) * chartHeight;

  const columns = months.map((m, i) => {
    const x = leftMargin + i * colSpacing;
    const colHeight = m.total > 0 ? (m.total / niceMax) * chartHeight : 0;
    let cursorY = chartBottom;
    const segments: Record<string, Segment> = {};

    STAGE_ORDER.forEach((stage) => {
      const count = m.counts[stage] ?? 0;
      if (count > 0 && m.total > 0) {
        const segHeight = Math.max(14, (count / m.total) * colHeight);
        const top = cursorY - segHeight;
        const rx = Math.min(8, segHeight / 2);
        segments[stage] = { top, bottom: cursorY, rx, hasBox: true };
        cursorY = top - segGap;
      } else {
        const top = cursorY - RIBBON_TAPER;
        segments[stage] = { top, bottom: cursorY, rx: 0, hasBox: false };
        cursorY = top;
      }
    });

    const visibleSegments = STAGE_ORDER.map((s) => segments[s]).filter(
      (seg) => seg.hasBox,
    );
    const topMost =
      visibleSegments.length > 0
        ? Math.min(...visibleSegments.map((seg) => seg.top))
        : chartBottom;

    return { x, key: m.key, label: m.label, total: m.total, segments, topMost };
  });

  const svgWidth =
    leftMargin + Math.max(0, n - 1) * colSpacing + colWidth + rightPad;

  const hoveredBucket = months.find((m) => m.key === displayMonth);
  const hoveredCol = columns.find((c) => c.key === displayMonth);
  const tooltipLeftPercent = hoveredCol
    ? ((hoveredCol.x + colWidth / 2) / svgWidth) * 100
    : 50;

  return (
    <Card
      className="hb-card hb-chart-gold"
      style={{ height: "100%" }}
      styles={{
        header: { padding: "8px 16px" },
        body: { padding: "16px" },
      }}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <IconWrapper
            color="rgba(176, 141, 87, 0.15)"
            glow="rgba(176, 141, 87, 0.4)"
            shape="square"
          >
            <NodeIndexOutlined style={{ color: "#B08D57" }} />
          </IconWrapper>
          <Text size="sm" style={{ marginLeft: "0.5rem" }}>
            Tasks by Stage Over Time
          </Text>
        </div>
      }
      extra={
        !isLoading && months.length > 0 ? (
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
      ) : months.length === 0 ? (
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
          <NodeIndexOutlined style={{ fontSize: "32px", color: "#4A4438" }} />
          <Text size="sm" style={{ color: "#9C9184" }}>
            No tasks yet
          </Text>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          {months.length < 2 && (
            <Text
              size="xs"
              style={{ color: "#9C9184", display: "block", marginBottom: 8 }}
            >
              Add tasks across more months to see stage flow over time.
            </Text>
          )}
          <div
            style={{ overflowX: "auto", flex: 1, minHeight: 0 }}
            ref={containerRef}
          >
            <div style={{ position: "relative", minWidth: 320 }}>
              <svg
                viewBox={`0 0 ${svgWidth} ${svgTotalHeight}`}
                style={{ width: "100%", minWidth: 320, height: svgTotalHeight }}
              >
                <defs>
                  <filter
                    id="stageGlow"
                    x="-50%"
                    y="-50%"
                    width="200%"
                    height="200%"
                  >
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter
                    id="ribbonGlass"
                    x="-20%"
                    y="-20%"
                    width="140%"
                    height="140%"
                  >
                    <feGaussianBlur stdDeviation="1.2" />
                  </filter>
                  {STAGE_ORDER.map((stage) => (
                    <linearGradient
                      key={stage}
                      id={`stageGrad-${stage.replace(/\s+/g, "-")}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={stageColor(stage)}
                        stopOpacity={0.32}
                      />
                      <stop
                        offset="95%"
                        stopColor={stageColor(stage)}
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                  ))}
                </defs>

                {/* Y-axis gridlines + tick values */}
                {yTicks.map((v) => (
                  <g key={v}>
                    <line
                      x1={leftMargin}
                      y1={yToPixel(v)}
                      x2={svgWidth - rightPad}
                      y2={yToPixel(v)}
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth={1}
                      strokeDasharray="4 4"
                    />
                    <text
                      x={leftMargin - 12}
                      y={yToPixel(v) + 3}
                      textAnchor="end"
                      fontSize="10"
                      fill="#9C9184"
                    >
                      {v}
                    </text>
                  </g>
                ))}

                {columns.slice(0, -1).map((col, i) => {
                  const next = columns[i + 1];
                  return STAGE_ORDER.map((stage) => {
                    const a = col.segments[stage];
                    const b = next.segments[stage];
                    if (!a.hasBox && !b.hasBox) return null;
                    const x1 = col.x + colWidth;
                    const x2 = next.x;
                    const midX = (x1 + x2) / 2;
                    const aTop = a.top + a.rx;
                    const aBottom = a.bottom - a.rx;
                    const bTop = b.top + b.rx;
                    const bBottom = b.bottom - b.rx;
                    const areaPath = `M ${x1},${aTop} C ${midX},${aTop} ${midX},${bTop} ${x2},${bTop} L ${x2},${bBottom} C ${midX},${bBottom} ${midX},${aBottom} ${x1},${aBottom} Z`;
                    const topLinePath = `M ${x1},${aTop} C ${midX},${aTop} ${midX},${bTop} ${x2},${bTop}`;
                    return (
                      <g key={`${stage}-${i}`}>
                        <path
                          d={areaPath}
                          fill={`url(#stageGrad-${stage.replace(/\s+/g, "-")})`}
                          filter="url(#ribbonGlass)"
                        />
                        <path
                          d={topLinePath}
                          fill="none"
                          stroke={stageColor(stage)}
                          strokeWidth={2.5}
                          strokeOpacity={0.9}
                        />
                      </g>
                    );
                  });
                })}

                {columns.map((col) => (
                  <g key={col.key}>
                    <rect
                      x={col.x - (colSpacing - colWidth) / 2}
                      y={0}
                      width={colSpacing}
                      height={chartBottom + 20}
                      fill="transparent"
                      style={{ cursor: "pointer" }}
                      onMouseEnter={() => setHoveredMonth(col.key)}
                      onMouseLeave={() => setHoveredMonth(null)}
                    />
                    {hoveredMonth === col.key && (
                      <line
                        x1={col.x + colWidth / 2}
                        y1={col.topMost - 8}
                        x2={col.x + colWidth / 2}
                        y2={chartBottom + 4}
                        stroke="rgba(176, 141, 87, 0.35)"
                        strokeWidth={1}
                        strokeDasharray="4 4"
                      />
                    )}
                    {hoveredMonth === col.key && (
                      <circle
                        cx={col.x + colWidth / 2}
                        cy={col.topMost}
                        r={4}
                        fill="#F0E9DC"
                        stroke="#B08D57"
                        strokeWidth={1.5}
                      />
                    )}
                    {STAGE_ORDER.map((stage) => {
                      const seg = col.segments[stage];
                      if (!seg.hasBox) return null;
                      const height = seg.bottom - seg.top;
                      return (
                        <rect
                          key={stage}
                          x={col.x}
                          y={seg.top}
                          width={colWidth}
                          height={height}
                          rx={seg.rx}
                          fill={stageColor(stage)}
                          filter="url(#stageGlow)"
                        />
                      );
                    })}
                    <text
                      x={col.x + colWidth / 2}
                      y={chartBottom + 18}
                      textAnchor="middle"
                      fontSize="11"
                      fill="#9C9184"
                    >
                      {col.label}
                    </text>
                  </g>
                ))}

                <text
                  x={leftMargin + (svgWidth - leftMargin - rightPad) / 2}
                  y={chartBottom + 36}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#9C9184"
                >
                  Month
                </text>
                <text
                  x={8}
                  y={chartBottom - chartHeight / 2}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#9C9184"
                  transform={`rotate(-90 8 ${chartBottom - chartHeight / 2})`}
                >
                  Tasks
                </text>
              </svg>

              <div
                className="hb-chart-tooltip-top"
                style={{
                  position: "absolute",
                  left: `${tooltipLeftPercent}%`,
                  top: 4,
                  transform: "translateX(-50%)",
                  minWidth: 150,
                  opacity: hoveredMonth ? 1 : 0,
                }}
              >
                {hoveredBucket && (
                  <>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#B08D57",
                        marginBottom: 6,
                      }}
                    >
                      {hoveredBucket.label}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#F0E9DC",
                        marginBottom: 8,
                      }}
                    >
                      Total: {hoveredBucket.total}
                    </div>
                    {TOOLTIP_ORDER.filter(
                      (s) => (hoveredBucket.counts[s] ?? 0) > 0,
                    ).map((s) => (
                      <div
                        key={s}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 16,
                          fontSize: 12,
                          marginBottom: 4,
                        }}
                      >
                        <span style={{ color: "#9C9184" }}>{s}</span>
                        <span style={{ color: "#F0E9DC", fontWeight: 600 }}>
                          {hoveredBucket.counts[s]}
                        </span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
          <div
            style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}
          >
            {STAGE_ORDER.map((stage) => (
              <span
                key={stage}
                style={{
                  fontSize: 11,
                  color: "#9C9184",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "2px",
                    background: stageColor(stage),
                    boxShadow: `0 0 5px ${stageColor(stage)}88`,
                    display: "inline-block",
                  }}
                />
                {stage}
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
