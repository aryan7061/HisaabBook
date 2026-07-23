import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";

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
import { Button, DatePicker, Input, Select, Space, Table, Tooltip } from "antd";
import { MailOutlined, SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import CustomAvatar from "@/components/custom-avatar";
import { Text } from "@/components/text";
import { ContactStatusTag } from "@/components/tags/contact-status-tag";
import { CONTACTS_LIST_QUERY } from "@/graphql/queries";
import { ContactsListQuery } from "@/graphql/types";
import { statusOptions } from "@/constants";
import { isDemoAccount } from "@/utilities/helpers";

type Contact = GetFieldsFromList<ContactsListQuery>;

type Identity = {
  id: string;
  email: string;
};

type SearchValues = {
  name?: string;
  companyName?: string;
};

type DateMode = "default" | "all" | "last7" | "last30" | "custom";

export const ContactList = ({ children }: React.PropsWithChildren) => {
  const go = useGo();
  const [searchParams] = useSearchParams();
  const companyParam = searchParams.get("company") ?? undefined;
  const [dateMode, setDateMode] = useState<DateMode>("default");
  const [customRange, setCustomRange] = useState<[string, string] | null>(null);

  const { data: identity, isLoading: identityLoading } =
    useGetIdentity<Identity>();
  const isDemo = isDemoAccount(identity?.email);

  // Same date-filter resolution as Companies/Deals -- kept as a separate
  // inline copy per file rather than a shared util, matching this
  // project's existing convention of duplicating small per-file helpers
  // (e.g. buildOwnerOptions repeated across the Create/Edit forms).
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

  const { tableProps, filters } = useTable<Contact, HttpError, SearchValues>({
    resource: "contacts",
    onSearch: (values) => {
      return [
        { field: "name", operator: "contains", value: values.name },
        {
          field: "companyName",
          operator: "contains",
          value: values.companyName,
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
        {
          field: "companyName",
          operator: "contains",
          value: companyParam,
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
      gqlQuery: CONTACTS_LIST_QUERY,
    },
  });

  const canModify = (record: Contact) => {
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
                    resource: "contacts",
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
          {...tableProps}
          loading={tableProps.loading || identityLoading}
          rowKey="id"
          pagination={{
            pageSize: 12,
            showSizeChanger: false,
          }}
          onRow={(record) => ({
            onClick: () =>
              go({
                to: {
                  resource: "contacts",
                  action: "edit",
                  id: (record as Contact).id!,
                },
                type: "push",
              }),
            style: { cursor: "pointer" },
            className: "hb-row-tilt",
          })}
        >
          <Table.Column<Contact>
            dataIndex="name"
            title="Name"
            defaultFilteredValue={getDefaultFilter("name", filters)}
            filterIcon={
              <SearchOutlined style={{ color: "#B08D57", fontSize: "16px" }} />
            }
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Input placeholder="Search Name" />
              </FilterDropdown>
            )}
            render={(_, record) => (
              <Space>
                <CustomAvatar name={record.name} src={record.avatarUrl} />
                <Text
                  ellipsis={{ tooltip: record.name }}
                  style={{ maxWidth: 160 }}
                >
                  {record.name}
                </Text>
              </Space>
            )}
          />
          <Table.Column<Contact>
            dataIndex="companyName"
            title="Company"
            defaultFilteredValue={getDefaultFilter("companyName", filters)}
            filterIcon={
              <SearchOutlined style={{ color: "#B08D57", fontSize: "16px" }} />
            }
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Input placeholder="Search Company" />
              </FilterDropdown>
            )}
            render={(value) => (
              <Text ellipsis={{ tooltip: value }} style={{ maxWidth: 160 }}>
                {value}
              </Text>
            )}
          />
          <Table.Column<Contact> dataIndex="jobTitle" title="Title" />
          <Table.Column<Contact>
            dataIndex="phone"
            title="Phone"
            render={(value) =>
              value ? (
                <Text style={{ whiteSpace: "nowrap" }}>{value}</Text>
              ) : (
                <Text style={{ color: "#d9d9d9" }}>—</Text>
              )
            }
          />
          <Table.Column<Contact>
            dataIndex="email"
            title="Email"
            render={(_, record) => (
              <Space size={4}>
                <Tooltip title={`Email ${record.name} via Gmail`}>
                  <Button
                    size="small"
                    type="text"
                    icon={<MailOutlined />}
                    onClick={() =>
                      window.open(
                        `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                          record.email,
                        )}`,
                        "_blank",
                        "noopener",
                      )
                    }
                  />
                </Tooltip>
                <Text
                  ellipsis={{ tooltip: record.email }}
                  style={{ maxWidth: 170 }}
                >
                  {record.email}
                </Text>
              </Space>
            )}
          />
          <Table.Column<Contact>
            dataIndex="status"
            title="Stage"
            render={(_, record) => <ContactStatusTag status={record.status} />}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Select
                  style={{ width: "200px" }}
                  mode="multiple"
                  placeholder="Select Stage"
                  options={statusOptions}
                />
              </FilterDropdown>
            )}
          />
          <Table.Column<Contact>
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
                    confirmTitle="Are you sure you want to delete this contact?"
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
