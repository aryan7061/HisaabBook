import CustomAvatar from "@/components/custom-avatar";
import { Text } from "@/components/text";
import { COMPANIES_LIST_QUERY } from "@/graphql/queries";
import { Company } from "@/graphql/schema.types";
import { formatIndianCurrency } from "@/utilities/helpers";
import { SearchOutlined, SortAscendingOutlined } from "@ant-design/icons";
import {
  CreateButton,
  DeleteButton,
  EditButton,
  FilterDropdown,
  List,
  useTable,
} from "@refinedev/antd";
import { getDefaultFilter, useGo } from "@refinedev/core";
import { Button, Dropdown, Input, MenuProps, Space, Table } from "antd";
import { useMemo, useState } from "react";

export const CompanyList = ({ children }: React.PropsWithChildren) => {
  const go = useGo();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);

  const { tableProps, filters } = useTable({
    resource: "companies",
    onSearch: (values: any) => {
      return [
        {
          field: "name",
          operator: "contains",
          value: values.name,
        },
      ];
    },
    pagination: {
      pageSize: 12,
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
    },
    meta: {
      gqlQuery: COMPANIES_LIST_QUERY,
    },
  });

  const { dataSource, ...restTableProps } = tableProps;

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

  return (
    <div>
      <List
        breadcrumb={false}
        headerButtons={() => (
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
        )}
      >
        <Table
          {...restTableProps}
          dataSource={sortedData}
          rowKey="id"
          pagination={{
            ...tableProps.pagination,
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
          })}
        >
          <Table.Column<Company>
            dataIndex="name"
            title="Company Title"
            defaultFilteredValue={getDefaultFilter("id", filters)}
            filterIcon={
              <SearchOutlined
                style={{
                  color: "#1677FF",
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
            render={(_, record) => (
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
            )}
          />
        </Table>
      </List>
      {children}
    </div>
  );
};
