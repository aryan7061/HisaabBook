import { useParams } from "react-router";
import { useState } from "react";

import { DeleteButton, FilterDropdown, useTable } from "@refinedev/antd";
import { GetFieldsFromList } from "@refinedev/nestjs-query";
import { useGetIdentity } from "@refinedev/core";

import {
  EditOutlined,
  MailOutlined,
  SearchOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Button, Card, Input, Select, Space, Table, Tooltip } from "antd";

import { statusOptions } from "@/constants";
import { COMPANY_CONTACTS_TABLE_QUERY } from "@/graphql/queries";
import { isDemoAccount } from "@/utilities/helpers";

import { CompanyContactsTableQuery } from "@/graphql/types";
import { Text } from "@/components/text";
import CustomAvatar from "@/components/custom-avatar";
import { ContactStatusTag } from "@/components/tags/contact-status-tag";
import { AddContactModal } from "@/components/add-contact-modal";
import { EditContactModal } from "@/components/edit-conatct-modal";

type Contact = GetFieldsFromList<CompanyContactsTableQuery>;

type Identity = {
  id: string;
  email: string;
};

export const CompanyContactsTable = () => {
  const params = useParams();
  const companyId = params?.id as string;
  const [addContactOpen, setAddContactOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  const { data: identity, isLoading: identityLoading } =
    useGetIdentity<Identity>();
  const isDemo = isDemoAccount(identity?.email);

  const { tableProps } = useTable<Contact>({
    resource: "contacts",
    syncWithLocation: false,
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
          field: "jobTitle",
          value: "",
          operator: "contains",
        },
        {
          field: "name",
          value: "",
          operator: "contains",
        },
        {
          field: "status",
          value: undefined,
          operator: "in",
        },
      ],

      permanent: [
        {
          field: "company.id",
          operator: "eq",
          value: companyId,
        },
        ...(isDemo
          ? []
          : [
              {
                field: "createdBy.id",
                operator: "eq" as const,
                value: identity?.id,
              },
            ]),
      ],
    },

    queryOptions: {
      enabled: !!identity?.id,
    },

    meta: {
      gqlQuery: COMPANY_CONTACTS_TABLE_QUERY,
    },
  });

  return (
    <Card
      styles={{
        header: {
          borderBottom: "1px solid #D9D9D9",
          marginBottom: "1px",
        },
        body: { padding: 0 },
      }}
      title={
        <Space size="middle">
          <TeamOutlined />
          <Text>Contacts</Text>
        </Space>
      }
      extra={
        <Space size="middle">
          <Text className="tertiary">Total contacts: </Text>
          <Text strong>
            {tableProps?.pagination !== false && tableProps.pagination?.total}
          </Text>
          <Button
            size="small"
            type="primary"
            icon={<TeamOutlined />}
            onClick={() => setAddContactOpen(true)}
          >
            Add Contact
          </Button>
        </Space>
      }
    >
      <Table
        {...tableProps}
        loading={tableProps.loading || identityLoading}
        rowKey="id"
        scroll={{ x: 760 }}
        pagination={{
          ...tableProps.pagination,
          showSizeChanger: false,
        }}
      >
        <Table.Column<Contact>
          title="Name"
          dataIndex="name"
          width={180}
          render={(_, record) => (
            <Space>
              <CustomAvatar name={record.name} src={record.avatarUrl} />
              <Text
                ellipsis={{ tooltip: record.name }}
                style={{ maxWidth: 130 }}
              >
                {record.name}
              </Text>
            </Space>
          )}
          filterIcon={<SearchOutlined />}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Input placeholder="Search Name" />
            </FilterDropdown>
          )}
        />
        <Table.Column<Contact>
          title="Title"
          dataIndex="jobTitle"
          width={160}
          render={(value) => (
            <Text ellipsis={{ tooltip: value }} style={{ maxWidth: 150 }}>
              {value}
            </Text>
          )}
          filterIcon={<SearchOutlined />}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Input placeholder="Search Title" />
            </FilterDropdown>
          )}
        />
        <Table.Column<Contact>
          title="Phone"
          dataIndex="phone"
          width={140}
          render={(_, record) =>
            record.phone ? (
              <Text style={{ whiteSpace: "nowrap" }}>{record.phone}</Text>
            ) : (
              <Text style={{ color: "#d9d9d9" }}>—</Text>
            )
          }
        />
        <Table.Column<Contact>
          title="Email"
          dataIndex="email"
          width={220}
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
          title="Stage"
          dataIndex="status"
          width={130}
          render={(_, record) => <ContactStatusTag status={record.status} />}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Select
                style={{ width: "200px" }}
                mode="multiple"
                placeholder="Select Stage"
                options={statusOptions}
              ></Select>
            </FilterDropdown>
          )}
        />
        <Table.Column<Contact>
          title="Actions"
          dataIndex="id"
          fixed="right"
          width={96}
          render={(_, record) => (
            <Space>
              <Button
                size="small"
                type="text"
                icon={<EditOutlined />}
                onClick={() => setEditingContact(record)}
              />
              <DeleteButton
                resource="contacts"
                recordItemId={record.id}
                hideText
                size="small"
                confirmTitle="Are you sure you want to delete this contact?"
                confirmOkText="Yes, Delete"
                confirmCancelText="Cancel"
              />
            </Space>
          )}
        />
      </Table>

      <AddContactModal
        open={addContactOpen}
        companyId={companyId}
        onClose={() => setAddContactOpen(false)}
        onCreated={() => setAddContactOpen(false)}
      />

      <EditContactModal
        open={!!editingContact}
        contact={editingContact}
        onClose={() => setEditingContact(null)}
        onUpdated={() => setEditingContact(null)}
      />
    </Card>
  );
};
