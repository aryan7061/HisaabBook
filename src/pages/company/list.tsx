import CustomAvatar from "@/components/custom-avatar";
import { Text } from "@/components/text";
import { COMPANIES_LIST_QUERY } from "@/graphql/queries";
import { Company } from "@/graphql/schema.types";
import { formatIndianCurrency, isDemoAccount } from "@/utilities/helpers";
import { SearchOutlined, SortAscendingOutlined } from "@ant-design/icons";
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
  useGetIdentity,
  useGo,
} from "@refinedev/core";
import {
  Button,
  DatePicker,
  Dropdown,
  Input,
  MenuProps,
  Select,
  Space,
  Table,
} from "antd";
import dayjs from "dayjs";
import { useMemo, useState } from "react";

type Identity = {
  id: string;
  email: string;
};

type DateMode = "default" | "all" | "last7" | "last30" | "custom";

export const CompanyList = ({ children }: React.PropsWithChildren) => {
  const go = useGo();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [dateMode, setDateMode] = useState<DateMode>("default");
  const [customRange, setCustomRange] = useState<[string, string] | null>(null);

  const { data: identity, isLoading: identityLoading } =
    useGetIdentity<Identity>();

  const isDemo = isDemoAccount(identity?.email);

  // Resolves the active Date Filter selection to 0, 1, or 2 CrudFilter
  // entries against createdAt. "default" is the quiet 30-day scope with no
  // dropdown option shown as selected; "all" removes date filtering
  // entirely; "custom" needs both a lower and upper bound since the user
  // picks an explicit start and end.
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

  const { tableProps, filters } = useTable({
    resource: "companies",
    onSearch: (values: { name?: string }) => {
      return [
        {
          field: "name",
          operator: "contains",
          value: values.name,
        },
      ];
    },
    pagination: {
      mode: "off",
    },
    sorters: {
      initial: [
        {
          field: "createdAt",
          order: "desc",
        },
      ],
    },
    filters: {
      initial: [
        {
          field: "name",
          operator: "contains",
          value: undefined,
        },
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
    queryOptions: {
      enabled: !!identity?.id,
    },
    meta: {
      gqlQuery: COMPANIES_LIST_QUERY,
    },
  });

  const {
    dataSource,
    pagination: _serverPagination,
    ...restTableProps
  } = tableProps;

  const sortedData = useMemo(() => {
    const data = (dataSource ?? []) as Company[];
    if (!sortOrder) return data;
    return [...data].sort((a, b) => {
      const aVal = a?.dealsAggregate?.[0]?.sum?.value || 0;
      const bVal = b?.dealsAggregate?.[0]?.sum?.value || 0;
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    });
  }, [dataSource, sortOrder]);

  const sortMenuItems: MenuProps["items"] = [
    {
      key: "asc",
      label: "Lowest to Highest",
      onClick: () => setSortOrder("asc"),
    },
    {
      key: "desc",
      label: "Highest to Lowest",
      onClick: () => setSortOrder("desc"),
    },
    {
      key: "clear",
      label: "Clear Sort",
      onClick: () => setSortOrder(null),
    },
  ];

  const canModify = (record: Company) => {
    return isDemo || record.createdBy?.id === identity?.id;
  };

  return (
    <div>
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
            <CreateButton
              onClick={() =>
                go({
                  to: {
                    resource: "companies",
                    action: "create",
                  },
                  options: {
                    keepQuery: true,
                  },
                  type: "replace",
                })
              }
            />
          </Space>
        )}
      >
        <Table
          {...restTableProps}
          loading={restTableProps.loading || identityLoading}
          dataSource={sortedData}
          rowKey="id"
          pagination={{
            pageSize: 12,
            showSizeChanger: false,
          }}
          onRow={(record) => ({
            onClick: () =>
              go({
                to: {
                  resource: "companies",
                  action: "edit",
                  id: (record as Company).id!,
                },
                type: "push",
              }),
            style: { cursor: "pointer" },
            className: "hb-row-tilt",
          })}
        >
          <Table.Column<Company>
            dataIndex="name"
            title="Company Title"
            defaultFilteredValue={getDefaultFilter("name", filters)}
            filterIcon={
              <SearchOutlined
                style={{
                  color: "#B08D57",
                  fontSize: "16px",
                }}
              />
            }
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Input placeholder="Search Company" />
              </FilterDropdown>
            )}
            render={(_, record) => (
              <Space>
                <CustomAvatar
                  shape="square"
                  name={record.name}
                  src={record.avatarUrl}
                />
                <Text style={{ whiteSpace: "nowrap" }}>{record.name}</Text>
              </Space>
            )}
          />
          <Table.Column<Company>
            dataIndex="totalRevenue"
            title={
              <Space>
                <Text>Open Deals Amount</Text>
                <Dropdown menu={{ items: sortMenuItems }} trigger={["click"]}>
                  <Button
                    size="small"
                    icon={<SortAscendingOutlined />}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Sort
                  </Button>
                </Dropdown>
              </Space>
            }
            render={(_, company) => (
              <Text>
                {formatIndianCurrency(
                  company?.dealsAggregate?.[0]?.sum?.value || 0,
                )}
              </Text>
            )}
          />
          <Table.Column<Company>
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
                    confirmTitle="Are you sure you want to delete this company?"
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
