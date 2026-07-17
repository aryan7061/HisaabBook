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
  getDefaultFilter,
  HttpError,
  useGetIdentity,
  useGo,
} from "@refinedev/core";
import { GetFieldsFromList } from "@refinedev/nestjs-query";
import { Button, Input, Select, Space, Table, Tooltip } from "antd";
import { MailOutlined, SearchOutlined } from "@ant-design/icons";

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

export const ContactList = ({ children }: React.PropsWithChildren) => {
  const go = useGo();
  const [searchParams] = useSearchParams();
  const companyParam = searchParams.get("company") ?? undefined;

  const { data: identity, isLoading: identityLoading } =
    useGetIdentity<Identity>();
  const isDemo = isDemoAccount(identity?.email);

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
      permanent: isDemo
        ? []
        : [
            {
              field: "createdBy.id",
              operator: "eq",
              value: identity?.id,
            },
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
