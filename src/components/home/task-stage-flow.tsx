import { useMemo, useState } from "react";
import { NodeIndexOutlined, DownloadOutlined } from "@ant-design/icons";
import { Button, Card, Skeleton } from "antd";
import { useCustom, useGetIdentity } from "@refinedev/core";
import dayjs from "dayjs";
import ExcelJS from "exceljs";

import { Text } from "../text";
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

const stageColor = (stage: string) =>
  stage === "Unassigned"
    ? unassignedStageColor
    : (taskStageColors[stage] ?? "#8c8c8c");

type MonthBucket = {
  key: string;
  label: string;
  counts: Record<string, number>;
  total: number;
};

export const TaskStageFlow = () => {
  const [exporting, setExporting] = useState(false);
  const { data: identity, isLoading: identityLoading } =
    useGetIdentity<Identity>();
  const isDemo = isDemoAccount(identity?.email);

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

  const chartHeight = 160;
  const chartBottom = 190;
  const colWidth = 56;
  const colSpacing = 130;
  const segGap = 5;
  const leftMargin = 50;

  const maxTotal = Math.max(1, ...months.map((m) => m.total));

  const columns = months.map((m, i) => {
    const x = leftMargin + i * colSpacing;
    const colHeight = m.total > 0 ? (m.total / maxTotal) * chartHeight : 0;
    let cursorY = chartBottom;
    const segments: Record<string, { top: number; bottom: number }> = {};

    STAGE_ORDER.forEach((stage) => {
      const count = m.counts[stage] ?? 0;
      if (count > 0 && m.total > 0) {
        const segHeight = Math.max(14, (count / m.total) * colHeight);
        const top = cursorY - segHeight;
        segments[stage] = { top, bottom: cursorY };
        cursorY = top - segGap;
      } else {
        segments[stage] = { top: cursorY, bottom: cursorY };
      }
    });

    return { x, label: m.label, total: m.total, segments };
  });

  const svgWidth =
    leftMargin + Math.max(0, months.length - 1) * colSpacing + colWidth + 20;

  return (
    <Card
      style={{ height: "100%" }}
      styles={{
        header: { padding: "8px 16px" },
        body: { padding: "16px" },
      }}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <NodeIndexOutlined />
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
            style={{ borderColor: "#B08D57", color: "#B08D57" }}
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
          <NodeIndexOutlined style={{ fontSize: "32px", color: "#d9d9d9" }} />
          <Text size="sm" style={{ color: "#d9d9d9" }}>
            No tasks yet
          </Text>
        </div>
      ) : (
        <>
          {months.length < 2 && (
            <Text
              size="xs"
              style={{ color: "#8c8c8c", display: "block", marginBottom: 8 }}
            >
              Add tasks across more months to see stage flow over time.
            </Text>
          )}
          <div style={{ overflowX: "auto" }}>
            <svg
              viewBox={`0 0 ${svgWidth} 230`}
              style={{ width: "100%", minWidth: 320, height: 230 }}
            >
              {columns.slice(0, -1).map((col, i) => {
                const next = columns[i + 1];
                return STAGE_ORDER.map((stage) => {
                  const a = col.segments[stage];
                  const b = next.segments[stage];
                  if (a.top === a.bottom && b.top === b.bottom) return null;
                  const x1 = col.x + colWidth;
                  const x2 = next.x;
                  const midX = (x1 + x2) / 2;
                  const path = `M ${x1},${a.top} C ${midX},${a.top} ${midX},${b.top} ${x2},${b.top} L ${x2},${b.bottom} C ${midX},${b.bottom} ${midX},${a.bottom} ${x1},${a.bottom} Z`;
                  return (
                    <path
                      key={`${stage}-${i}`}
                      d={path}
                      fill={stageColor(stage)}
                      fillOpacity={0.18}
                    />
                  );
                });
              })}

              {columns.map((col) => (
                <g key={col.label}>
                  {(() => {
                    const visibleTops = STAGE_ORDER.map(
                      (s) => col.segments[s],
                    ).filter((seg) => seg.bottom - seg.top > 0);
                    const topMost =
                      visibleTops.length > 0
                        ? Math.min(...visibleTops.map((seg) => seg.top))
                        : chartBottom;
                    return (
                      <text
                        x={col.x + colWidth / 2}
                        y={topMost - 10}
                        textAnchor="middle"
                        fontSize="12"
                        fontWeight={500}
                        fill="#3B2A20"
                      >
                        {col.total}
                      </text>
                    );
                  })()}
                  {STAGE_ORDER.map((stage) => {
                    const seg = col.segments[stage];
                    const height = seg.bottom - seg.top;
                    if (height <= 0) return null;
                    return (
                      <rect
                        key={stage}
                        x={col.x}
                        y={seg.top}
                        width={colWidth}
                        height={height}
                        rx={Math.min(8, height / 2)}
                        fill={stageColor(stage)}
                      />
                    );
                  })}
                  <text
                    x={col.x + colWidth / 2}
                    y={chartBottom + 18}
                    textAnchor="middle"
                    fontSize="11"
                    fill="#8c8c8c"
                  >
                    {col.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
          <div
            style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}
          >
            {STAGE_ORDER.map((stage) => (
              <span
                key={stage}
                style={{
                  fontSize: 11,
                  color: stageColor(stage),
                  fontWeight: 500,
                }}
              >
                ● {stage}
              </span>
            ))}
          </div>
        </>
      )}
    </Card>
  );
};
