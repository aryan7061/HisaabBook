import { useEffect, useMemo, useState } from "react";
import {
  CreateButton,
  DeleteButton,
  EditButton,
  FilterDropdown,
  List,
  useTable,
} from "@refinedev/antd";
import {
  getDefaultFilter,
  HttpError,
  useGetIdentity,
  useGo,
} from "@refinedev/core";
import { GetFieldsFromList } from "@refinedev/nestjs-query";
import { Button, Card, Col, Input, Row, Select, Space, Table } from "antd";
import {
  DownloadOutlined,
  SearchOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import { Column } from "@ant-design/plots";
import ExcelJS from "exceljs";

import CustomAvatar from "@/components/custom-avatar";
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

const STAGE_TITLES = ["NEW LEAD", "NEGOTIATION", "WON", "LOST"];
const FX_API_URL = "https://api.frankfurter.dev/v1/latest?base=INR&symbols=USD";

const StatCard = ({ label, value }: { label: string; value: string }) => (
  <Card style={{ height: "100%" }} styles={{ body: { padding: "14px 16px" } }}>
    <Text size="xs" style={{ color: "#8c8c8c" }}>
      {label}
    </Text>
    <div
      style={{ fontSize: 22, fontWeight: 500, color: "#3B2A20", marginTop: 4 }}
    >
      {value}
    </div>
  </Card>
);

export const DealList = ({ children }: React.PropsWithChildren) => {
  const go = useGo();
  const { data: identity, isLoading: identityLoading } =
    useGetIdentity<Identity>();
  const isDemo = isDemoAccount(identity?.email);

  const [currency, setCurrency] = useState<Currency>("INR");
  const [usdRate, setUsdRate] = useState<number | null>(null);
  const [rateError, setRateError] = useState(false);
  const [exporting, setExporting] = useState(false);

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
      permanent: isDemo
        ? []
        : [{ field: "createdBy.id", operator: "eq", value: identity?.id }],
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

  const stageChartConfig = {
    data: stageChartData,
    xField: "stage",
    yField: "value",
    colorField: "stage",
    scale: {
      color: {
        domain: STAGE_TITLES,
        range: STAGE_TITLES.map((t) => getDealStageColor(t)),
      },
    },
    legend: false,
    axis: {
      y: { labelFormatter: (v: number) => formatCurrency(v) },
    },
    tooltip: {
      items: [
        {
          field: "value",
          valueFormatter: (v: number) => formatCurrency(v),
        },
      ],
    },
    label: false,
  } as any;

  const companyChartConfig = {
    data: companyChartData,
    xField: "company",
    yField: "value",
    colorField: "#B08D57",
    scale: { color: { range: ["#B08D57"] } },
    legend: false,
    axis: {
      y: { labelFormatter: (v: number) => formatCurrency(v) },
    },
    tooltip: {
      items: [
        {
          field: "value",
          valueFormatter: (v: number) => formatCurrency(v),
        },
      ],
    },
    label: false,
  } as any;

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
            title={<Text size="sm">Pipeline value by stage</Text>}
            styles={{ body: { padding: "12px 16px" } }}
          >
            {stageChartData.some((d) => d.value > 0) ? (
              <Column {...stageChartConfig} height={220} />
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
            title={<Text size="sm">Top companies by deal value</Text>}
            styles={{ body: { padding: "12px 16px" } }}
          >
            {companyChartData.length ? (
              <Column {...companyChartConfig} height={220} />
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
            <Button
              shape="round"
              icon={<SwapOutlined />}
              onClick={toggleCurrency}
              disabled={!usdRate && !rateError}
              style={{
                borderColor: "#B08D57",
                color: "#B08D57",
                fontWeight: 500,
              }}
            >
              {currency === "INR" ? "Change to Dollar" : "Change to Rupee"}
            </Button>
            <Button
              shape="round"
              icon={<DownloadOutlined />}
              onClick={handleExport}
              loading={exporting}
              style={{
                borderColor: "#B08D57",
                color: "#B08D57",
                fontWeight: 500,
              }}
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
            dataIndex="stage"
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
