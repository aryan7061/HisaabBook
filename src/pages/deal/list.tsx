import { useEffect, useMemo, useRef, useState } from "react";
import {
  CreateButton,
  DeleteButton,
  EditButton,
  FilterDropdown,
  List,
  useTable,
} from "@refinedev/antd";
import {
  CrudFilter,
  getDefaultFilter,
  HttpError,
  useGetIdentity,
  useGo,
} from "@refinedev/core";
import { GetFieldsFromList } from "@refinedev/nestjs-query";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Input,
  Row,
  Select,
  Space,
  Table,
} from "antd";
import {
  DownloadOutlined,
  SearchOutlined,
  ShopOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import ExcelJS from "exceljs";
import dayjs from "dayjs";

import CustomAvatar from "@/components/custom-avatar";
import { IconWrapper } from "@/constants";
import { Text } from "@/components/text";
import { DEALS_LIST_QUERY } from "@/graphql/queries";
import { DealsListQuery } from "@/graphql/types";
import { formatIndianCurrency, isDemoAccount } from "@/utilities/helpers";
import { getDealStageColor } from "@/utilities/deal-stage-colors";

type Deal = GetFieldsFromList<DealsListQuery>;

type Identity = {
  id: string;
  email: string;
};

type SearchValues = {
  title?: string;
  companyName?: string;
};

type Currency = "INR" | "USD";
type DateMode = "default" | "all" | "last7" | "last30" | "custom";

const STAGE_TITLES = ["NEW LEAD", "NEGOTIATION", "WON", "LOST"];
const FX_API_URL = "https://api.frankfurter.dev/v1/latest?base=INR&symbols=USD";

// Picks a "nice" round step (1/2/5/10 x a power of 10) for axis ticks.
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

const StatCard = ({ label, value }: { label: string; value: string }) => (
  <Card
    className="hb-card hb-chart-gold"
    style={{ height: "100%" }}
    styles={{ body: { padding: "14px 16px" } }}
  >
    <Text size="md" className="secondary">
      {label}
    </Text>
    <div style={{ marginTop: 4 }}>
      <Text size="xxxl" strong>
        {value}
      </Text>
    </div>
  </Card>
);

// Custom SVG bar chart for "Pipeline value by stage" -- replaces the
// @ant-design/plots <Column /> that was used here before. That library's
// interval-mark animation system throws an uncaught "Mismatched
// interpolation arguments" error whenever style.radius (rounded corners) is
// combined with this chart's hover-highlight interaction, and disabling
// animation (both as a boolean and as an explicit per-phase object) did not
// stop it. Building this chart by hand sidesteps that entirely -- there's no
// G2 animation/interpolation system involved, so rounded top corners (drawn
// as a plain SVG path, not a mark style) can't hit the same bug.
const PipelineStageChart = ({
  data,
  formatCurrency,
}: {
  data: { stage: string; value: number }[];
  formatCurrency: (v: number) => string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(500);
  const [hoveredStage, setHoveredStage] = useState<string | null>(null);
  const [displayStage, setDisplayStage] = useState<string | null>(null);

  useEffect(() => {
    if (hoveredStage) setDisplayStage(hoveredStage);
  }, [hoveredStage]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width) setContainerWidth(width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const leftMargin = 70;
  const rightPad = 16;
  const topPad = 30;
  const chartBottom = 170;
  const chartHeight = chartBottom - topPad;
  const svgTotalHeight = chartBottom + 34;

  const maxValue = Math.max(1, ...data.map((d) => d.value));
  const yStep = niceStep(maxValue);
  const yTicks: number[] = [];
  for (let v = 0; v <= maxValue; v += yStep) yTicks.push(v);
  if (yTicks[yTicks.length - 1] < maxValue) {
    yTicks.push(yTicks[yTicks.length - 1] + yStep);
  }
  const niceMax = yTicks[yTicks.length - 1];

  const plotWidth = Math.max(200, containerWidth - leftMargin - rightPad);
  const slotWidth = plotWidth / data.length;
  const barWidth = Math.min(56, slotWidth * 0.5);

  const yToPixel = (v: number) => chartBottom - (v / niceMax) * chartHeight;

  const bars = data.map((d, i) => {
    const x = leftMargin + i * slotWidth + (slotWidth - barWidth) / 2;
    const barTop = yToPixel(d.value);
    const barHeight = chartBottom - barTop;
    return {
      ...d,
      x,
      barTop,
      barHeight,
      color: getDealStageColor(d.stage),
    };
  });

  const svgWidth = leftMargin + plotWidth + rightPad;
  const radius = 6;

  // Rounded-top-only bar outline: two quadratic-curve corners at the top,
  // flat bottom -- a plain path, not a mark style, so it can't trigger the
  // G2 animation bug at all.
  const barPath = (x: number, y: number, w: number, h: number, r: number) => {
    const rr = Math.min(r, w / 2, h);
    return `M ${x},${y + rr} Q ${x},${y} ${x + rr},${y} L ${x + w - rr},${y} Q ${x + w},${y} ${x + w},${y + rr} L ${x + w},${y + h} L ${x},${y + h} Z`;
  };

  const hoveredBar = bars.find((b) => b.stage === displayStage);
  const tooltipLeftPercent = hoveredBar
    ? ((hoveredBar.x + barWidth / 2) / svgWidth) * 100
    : 50;

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      <svg
        viewBox={`0 0 ${svgWidth} ${svgTotalHeight}`}
        style={{ width: "100%", height: svgTotalHeight }}
      >
        <defs>
          <filter
            id="pipelineBarGlow"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {bars.map((b) => (
            <linearGradient
              key={b.stage}
              id={`pipeGrad-${b.stage.replace(/\s+/g, "-")}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={b.color} stopOpacity={1} />
              <stop offset="100%" stopColor={b.color} stopOpacity={0.55} />
            </linearGradient>
          ))}
        </defs>

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
              x={leftMargin - 10}
              y={yToPixel(v) + 3}
              textAnchor="end"
              fontSize="11"
              fill="#B7A77C"
            >
              {formatCurrency(v)}
            </text>
          </g>
        ))}

        {bars.map((b) => (
          <g
            key={b.stage}
            onMouseEnter={() => setHoveredStage(b.stage)}
            onMouseLeave={() => setHoveredStage(null)}
            style={{ cursor: "pointer" }}
          >
            <rect
              x={b.x - 6}
              y={topPad - 6}
              width={barWidth + 12}
              height={chartBottom - topPad + 12}
              fill="transparent"
            />
            <path
              d={barPath(b.x, b.barTop, barWidth, b.barHeight, radius)}
              fill={`url(#pipeGrad-${b.stage.replace(/\s+/g, "-")})`}
              filter="url(#pipelineBarGlow)"
              opacity={hoveredStage && hoveredStage !== b.stage ? 0.55 : 1}
              style={{ transition: "opacity 0.2s ease" }}
            />
            <text
              x={b.x + barWidth / 2}
              y={b.barTop - 10}
              textAnchor="middle"
              fontSize="12"
              fontWeight={500}
              fill="#B7A77C"
            >
              {formatCurrency(b.value)}
            </text>
            <text
              x={b.x + barWidth / 2}
              y={chartBottom + 20}
              textAnchor="middle"
              fontSize="11"
              fill="#9C9184"
            >
              {b.stage}
            </text>
          </g>
        ))}
      </svg>

      <div
        className="hb-chart-tooltip-top"
        style={{
          position: "absolute",
          left: `${tooltipLeftPercent}%`,
          top: 4,
          transform: "translateX(-50%)",
          minWidth: 110,
          opacity: hoveredStage ? 1 : 0,
        }}
      >
        {hoveredBar && (
          <>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#C9A868",
                marginBottom: 4,
              }}
            >
              {hoveredBar.stage}
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#F0E9DC" }}>
              {formatCurrency(hoveredBar.value)}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Custom SVG bar chart for "Top companies by deal value" -- built the same
// way as PipelineStageChart, for the same reason: rounded corners + hover
// interaction + value labels on @ant-design/plots's Column is what crashed
// the Pipeline chart's animation system, so this sidesteps that entirely
// rather than risk repeating it.
const CompanyChart = ({
  data,
  formatCurrency,
}: {
  data: { company: string; value: number }[];
  formatCurrency: (v: number) => string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(500);
  const [hoveredCompany, setHoveredCompany] = useState<string | null>(null);
  const [displayCompany, setDisplayCompany] = useState<string | null>(null);

  useEffect(() => {
    if (hoveredCompany) setDisplayCompany(hoveredCompany);
  }, [hoveredCompany]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width) setContainerWidth(width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const leftMargin = 70;
  const rightPad = 16;
  const topPad = 30;
  const chartBottom = 170;
  const chartHeight = chartBottom - topPad;
  const svgTotalHeight = chartBottom + 34;

  const maxValue = Math.max(1, ...data.map((d) => d.value));
  const yStep = niceStep(maxValue);
  const yTicks: number[] = [];
  for (let v = 0; v <= maxValue; v += yStep) yTicks.push(v);
  if (yTicks[yTicks.length - 1] < maxValue) {
    yTicks.push(yTicks[yTicks.length - 1] + yStep);
  }
  const niceMax = yTicks[yTicks.length - 1];

  const plotWidth = Math.max(200, containerWidth - leftMargin - rightPad);
  const slotWidth = plotWidth / data.length;
  const barWidth = Math.min(56, slotWidth * 0.5);

  const yToPixel = (v: number) => chartBottom - (v / niceMax) * chartHeight;

  const bars = data.map((d, i) => {
    const x = leftMargin + i * slotWidth + (slotWidth - barWidth) / 2;
    const barTop = yToPixel(d.value);
    const barHeight = chartBottom - barTop;
    return { ...d, x, barTop, barHeight };
  });

  const svgWidth = leftMargin + plotWidth + rightPad;
  const radius = 6;

  const barPath = (x: number, y: number, w: number, h: number, r: number) => {
    const rr = Math.min(r, w / 2, h);
    return `M ${x},${y + rr} Q ${x},${y} ${x + rr},${y} L ${x + w - rr},${y} Q ${x + w},${y} ${x + w},${y + rr} L ${x + w},${y + h} L ${x},${y + h} Z`;
  };

  const hoveredBar = bars.find((b) => b.company === displayCompany);
  const tooltipLeftPercent = hoveredBar
    ? ((hoveredBar.x + barWidth / 2) / svgWidth) * 100
    : 50;

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      <svg
        viewBox={`0 0 ${svgWidth} ${svgTotalHeight}`}
        style={{ width: "100%", height: svgTotalHeight }}
      >
        <defs>
          <filter
            id="companyBarGlow"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="companyBarGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D9BD7D" />
            <stop offset="100%" stopColor="#94713F" />
          </linearGradient>
        </defs>

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
              x={leftMargin - 10}
              y={yToPixel(v) + 3}
              textAnchor="end"
              fontSize="11"
              fill="#B7A77C"
            >
              {formatCurrency(v)}
            </text>
          </g>
        ))}

        {bars.map((b) => (
          <g
            key={b.company}
            onMouseEnter={() => setHoveredCompany(b.company)}
            onMouseLeave={() => setHoveredCompany(null)}
            style={{ cursor: "pointer" }}
          >
            {hoveredCompany === b.company && (
              <rect
                x={b.x - (slotWidth - barWidth) / 2}
                y={topPad}
                width={slotWidth}
                height={chartHeight}
                fill="rgba(176,141,87,0.08)"
              />
            )}
            <rect
              x={b.x - 6}
              y={topPad - 6}
              width={barWidth + 12}
              height={chartBottom - topPad + 12}
              fill="transparent"
            />
            <path
              d={barPath(b.x, b.barTop, barWidth, b.barHeight, radius)}
              fill="url(#companyBarGrad)"
              filter="url(#companyBarGlow)"
              opacity={
                hoveredCompany && hoveredCompany !== b.company ? 0.55 : 1
              }
              style={{ transition: "opacity 0.2s ease" }}
            />
            <text
              x={b.x + barWidth / 2}
              y={b.barTop - 10}
              textAnchor="middle"
              fontSize="12"
              fontWeight={500}
              fill="#B7A77C"
            >
              {formatCurrency(b.value)}
            </text>
            <text
              x={b.x + barWidth / 2}
              y={chartBottom + 20}
              textAnchor="middle"
              fontSize="11"
              fill="#9C9184"
            >
              {b.company}
            </text>
          </g>
        ))}
      </svg>

      <div
        className="hb-chart-tooltip-top"
        style={{
          position: "absolute",
          left: `${tooltipLeftPercent}%`,
          top: 4,
          transform: "translateX(-50%)",
          minWidth: 110,
          opacity: hoveredCompany ? 1 : 0,
        }}
      >
        {hoveredBar && (
          <>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#C9A868",
                marginBottom: 4,
              }}
            >
              {hoveredBar.company}
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#F0E9DC" }}>
              {formatCurrency(hoveredBar.value)}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export const DealList = ({ children }: React.PropsWithChildren) => {
  const go = useGo();
  const { data: identity, isLoading: identityLoading } =
    useGetIdentity<Identity>();
  const isDemo = isDemoAccount(identity?.email);

  const [currency, setCurrency] = useState<Currency>("INR");
  const [usdRate, setUsdRate] = useState<number | null>(null);
  const [rateError, setRateError] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [dateMode, setDateMode] = useState<DateMode>("default");
  const [customRange, setCustomRange] = useState<[string, string] | null>(null);

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

  const formatCurrency = (value: number): string => {
    if (currency === "USD" && usdRate) {
      const usdValue = value * usdRate;
      if (usdValue >= 1000000) return `$${(usdValue / 1000000).toFixed(2)}M`;
      if (usdValue >= 1000) return `$${(usdValue / 1000).toFixed(2)}K`;
      return `$${usdValue.toFixed(2)}`;
    }
    return formatIndianCurrency(value);
  };

  const toggleCurrency = () =>
    setCurrency((prev) => (prev === "INR" ? "USD" : "INR"));

  // Resolves the active Date Filter selection to 0, 1, or 2 CrudFilter
  // entries against createdAt. "default" is the quiet 30-day scope with no
  // dropdown option shown as selected; "all" removes date filtering
  // entirely; "custom" needs both a lower and upper bound.
  const dateFilters: CrudFilter[] = useMemo(() => {
    const now = dayjs();
    switch (dateMode) {
      case "all":
        return [];
      case "last7":
        return [
          {
            field: "createdAt",
            operator: "gte",
            value: now.subtract(7, "day").startOf("day").toISOString(),
          },
        ];
      case "last30":
        return [
          {
            field: "createdAt",
            operator: "gte",
            value: now.subtract(30, "day").startOf("day").toISOString(),
          },
        ];
      case "custom":
        return customRange
          ? [
              {
                field: "createdAt",
                operator: "gte",
                value: dayjs(customRange[0]).startOf("day").toISOString(),
              },
              {
                field: "createdAt",
                operator: "lte",
                value: dayjs(customRange[1]).endOf("day").toISOString(),
              },
            ]
          : [];
      default:
        return [
          {
            field: "createdAt",
            operator: "gte",
            value: now.subtract(30, "day").startOf("day").toISOString(),
          },
        ];
    }
  }, [dateMode, customRange]);

  const { tableProps, filters } = useTable<Deal, HttpError, SearchValues>({
    resource: "deals",
    onSearch: (values) => [
      { field: "title", operator: "contains", value: values.title },
      {
        field: "company.name",
        operator: "contains",
        value: values.companyName,
      },
    ],
    pagination: { mode: "off" },
    sorters: {
      initial: [{ field: "createdAt", order: "desc" }],
    },
    filters: {
      initial: [
        { field: "title", operator: "contains", value: undefined },
        { field: "company.name", operator: "contains", value: undefined },
        { field: "stage.title", operator: "in", value: undefined },
      ],
      permanent: [
        ...(isDemo
          ? []
          : [
              {
                field: "createdBy.id",
                operator: "eq",
                value: identity?.id,
              } as CrudFilter,
            ]),
        ...dateFilters,
      ],
    },
    queryOptions: { enabled: !!identity?.id },
    meta: { gqlQuery: DEALS_LIST_QUERY },
  });

  const deals = (tableProps.dataSource ?? []) as Deal[];

  const canModify = (record: Deal) =>
    isDemo || record.createdBy?.id === identity?.id;

  const summary = useMemo(() => {
    const won = deals.filter((d) => d.stage?.title === "WON");
    const lost = deals.filter((d) => d.stage?.title === "LOST");
    const open = deals.filter(
      (d) => d.stage?.title !== "WON" && d.stage?.title !== "LOST",
    );
    const pipelineValue = open.reduce((sum, d) => sum + (d.value ?? 0), 0);

    return {
      total: deals.length,
      open: open.length,
      won: won.length,
      lost: lost.length,
      pipelineValue,
    };
  }, [deals]);

  const stageChartData = useMemo(() => {
    return STAGE_TITLES.map((title) => ({
      stage: title,
      value: deals
        .filter((d) => d.stage?.title === title)
        .reduce((sum, d) => sum + (d.value ?? 0), 0),
    }));
  }, [deals]);

  const companyChartData = useMemo(() => {
    const byCompany = new Map<string, number>();
    deals.forEach((d) => {
      const name = d.company?.name ?? "Unknown";
      byCompany.set(name, (byCompany.get(name) ?? 0) + (d.value ?? 0));
    });
    return Array.from(byCompany.entries())
      .map(([company, value]) => ({ company, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [deals]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Deals");

      sheet.columns = [
        { header: "Deal", key: "title", width: 26 },
        { header: "Company", key: "company", width: 20 },
        { header: "Owner", key: "owner", width: 18 },
        { header: "Value (INR)", key: "valueInr", width: 14 },
        { header: "Value (USD)", key: "valueUsd", width: 14 },
        { header: "Stage", key: "stage", width: 14 },
        { header: "Close date", key: "closeDate", width: 14 },
      ];

      deals.forEach((d) => {
        sheet.addRow({
          title: d.title,
          company: d.company?.name ?? "",
          owner: d.dealOwner?.name ?? "",
          valueInr: d.value ?? 0,
          valueUsd:
            usdRate && d.value ? Number((d.value * usdRate).toFixed(2)) : "",
          stage: d.stage?.title ?? "",
          closeDate: d.closeDate
            ? new Date(d.closeDate).toLocaleDateString()
            : "",
        });
      });

      sheet.getRow(1).font = { bold: true };

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "deals.xlsx";
      link.click();
      window.URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={8} lg={4}>
          <StatCard label="Total deals" value={String(summary.total)} />
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <StatCard label="Open deals" value={String(summary.open)} />
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <StatCard label="Won deals" value={String(summary.won)} />
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <StatCard label="Lost deals" value={String(summary.lost)} />
        </Col>
        <Col xs={24} sm={16} lg={8}>
          <StatCard
            label="Pipeline value (open)"
            value={formatCurrency(summary.pipelineValue)}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} lg={12}>
          <Card
            className="hb-card hb-chart-gold"
            title={
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  letterSpacing: "0.01em",
                  color: "#F0E9DC",
                }}
              >
                Pipeline value by stage
              </Text>
            }
            styles={{
              header: { padding: "16px 20px" },
              body: { padding: "20px 24px 24px" },
            }}
          >
            {stageChartData.some((d) => d.value > 0) ? (
              <PipelineStageChart
                data={stageChartData}
                formatCurrency={formatCurrency}
              />
            ) : (
              <div
                style={{
                  height: 220,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#d9d9d9",
                }}
              >
                No deal value yet
              </div>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            className="hb-card hb-chart-gold"
            title={
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <IconWrapper
                  color="rgba(176, 141, 87, 0.15)"
                  glow="rgba(176, 141, 87, 0.4)"
                  shape="square"
                >
                  <ShopOutlined style={{ color: "#B08D57" }} />
                </IconWrapper>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    letterSpacing: "0.01em",
                    color: "#F0E9DC",
                  }}
                >
                  Top companies by deal value
                </Text>
              </div>
            }
            styles={{
              header: { padding: "16px 20px" },
              body: { padding: "20px 24px 24px" },
            }}
          >
            {companyChartData.length ? (
              <CompanyChart
                data={companyChartData}
                formatCurrency={formatCurrency}
              />
            ) : (
              <div
                style={{
                  height: 220,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#d9d9d9",
                }}
              >
                No deals yet
              </div>
            )}
          </Card>
        </Col>
      </Row>

      <List
        breadcrumb={false}
        headerButtons={() => (
          <Space>
            <Select
              placeholder="Filter by date"
              allowClear
              style={{ minWidth: 160 }}
              value={dateMode === "default" ? undefined : dateMode}
              onChange={(value) => setDateMode(value ?? "default")}
              options={[
                { label: "All", value: "all" },
                { label: "Last 7 Days", value: "last7" },
                { label: "Last 30 Days", value: "last30" },
                { label: "Custom Range", value: "custom" },
              ]}
            />
            {dateMode === "custom" && (
              <DatePicker.RangePicker
                onChange={(dates) => {
                  if (dates && dates[0] && dates[1]) {
                    setCustomRange([
                      dates[0].toISOString(),
                      dates[1].toISOString(),
                    ]);
                  } else {
                    setCustomRange(null);
                  }
                }}
              />
            )}
            <Button
              shape="round"
              icon={<SwapOutlined />}
              onClick={toggleCurrency}
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
            <CreateButton
              onClick={() =>
                go({
                  to: { resource: "deals", action: "create" },
                  options: { keepQuery: true },
                  type: "replace",
                })
              }
            />
          </Space>
        )}
      >
        <Table
          {...tableProps}
          loading={tableProps.loading || identityLoading}
          rowKey="id"
          pagination={{ pageSize: 12, showSizeChanger: false }}
          onRow={(record) => ({
            onClick: () =>
              go({
                to: {
                  resource: "deals",
                  action: "edit",
                  id: (record as Deal).id!,
                },
                type: "push",
              }),
            style: { cursor: "pointer" },
            className: "hb-row-tilt",
          })}
        >
          <Table.Column<Deal>
            dataIndex="title"
            title="Deal"
            defaultFilteredValue={getDefaultFilter("title", filters)}
            filterIcon={
              <SearchOutlined style={{ color: "#B08D57", fontSize: 16 }} />
            }
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Input placeholder="Search deal" />
              </FilterDropdown>
            )}
          />
          <Table.Column<Deal>
            dataIndex="company"
            title="Company"
            defaultFilteredValue={getDefaultFilter("company.name", filters)}
            filterIcon={
              <SearchOutlined style={{ color: "#B08D57", fontSize: 16 }} />
            }
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Input placeholder="Search company" />
              </FilterDropdown>
            )}
            render={(_, record) => (
              <Space>
                <CustomAvatar
                  shape="square"
                  name={record.company?.name ?? ""}
                  src={record.company?.avatarUrl}
                />
                <Text>{record.company?.name}</Text>
              </Space>
            )}
          />
          <Table.Column<Deal>
            dataIndex="dealOwner"
            title="Owner"
            render={(_, record) =>
              record.dealOwner ? (
                <Space>
                  <CustomAvatar
                    name={record.dealOwner.name}
                    src={record.dealOwner.avatarUrl}
                  />
                  <Text>{record.dealOwner.name}</Text>
                </Space>
              ) : (
                <Text style={{ color: "#d9d9d9" }}>—</Text>
              )
            }
          />
          <Table.Column<Deal>
            dataIndex="value"
            title="Value"
            render={(value) => <Text>{formatCurrency(value ?? 0)}</Text>}
          />
          <Table.Column<Deal>
            dataIndex="stage.title"
            title="Stage"
            defaultFilteredValue={getDefaultFilter("stage.title", filters)}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Select
                  style={{ width: 200 }}
                  mode="multiple"
                  placeholder="Select stage"
                  options={STAGE_TITLES.map((t) => ({ label: t, value: t }))}
                />
              </FilterDropdown>
            )}
            render={(_, record) =>
              record.stage ? (
                <span
                  style={{
                    background: `${getDealStageColor(record.stage.title)}22`,
                    color: getDealStageColor(record.stage.title),
                    fontSize: 12,
                    fontWeight: 500,
                    padding: "2px 10px",
                    borderRadius: 10,
                  }}
                >
                  {record.stage.title}
                </span>
              ) : (
                <Text style={{ color: "#d9d9d9" }}>—</Text>
              )
            }
          />
          <Table.Column<Deal>
            dataIndex="closeDate"
            title="Close date"
            render={(value) =>
              value ? (
                <Text>{new Date(value).toLocaleDateString()}</Text>
              ) : (
                <Text style={{ color: "#d9d9d9" }}>—</Text>
              )
            }
          />
          <Table.Column<Deal>
            dataIndex="id"
            title="Actions"
            fixed="right"
            render={(_, record) =>
              canModify(record) ? (
                <Space onClick={(e) => e.stopPropagation()}>
                  <EditButton hideText size="small" recordItemId={record.id} />
                  <DeleteButton
                    hideText
                    size="small"
                    recordItemId={record.id}
                    confirmTitle="Are you sure you want to delete this deal?"
                    confirmOkText="Yes, Delete"
                    confirmCancelText="Cancel"
                  />
                </Space>
              ) : (
                <Text style={{ color: "#d9d9d9" }}>—</Text>
              )
            }
          />
        </Table>
      </List>
      {children}
    </div>
  );
};
