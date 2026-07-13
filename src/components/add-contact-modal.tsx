import { useState } from "react";

import { useSelect } from "@refinedev/antd";
import { useCreate, useGetIdentity, useInvalidate } from "@refinedev/core";
import { GetFieldsFromList } from "@refinedev/nestjs-query";

import { Button, Divider, Form, Input, Modal, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

import { CREATE_CONTACT_MUTATION } from "@/graphql/mutations";
import { USERS_SELECT_QUERY } from "@/graphql/queries";
import { UsersSelectQuery } from "@/graphql/types";
import { statusOptions } from "@/constants";
import { SelectOptionWithAvatar } from "@/components/select-option-with-avatar";
import { AddSalesOwnerModal } from "@/components/add-sales-owner-modal";
import { buildUserScopeFilters, isDemoAccount } from "@/utilities/helpers";

type Props = {
  open: boolean;
  companyId: string;
  onClose: () => void;
  onCreated: () => void;
};

type ExtraOption = {
  value: string;
  label: React.ReactNode;
  searchLabel: string;
};

type Identity = {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
};

export const AddContactModal = ({
  open,
  companyId,
  onClose,
  onCreated,
}: Props) => {
  const [form] = Form.useForm();
  const [addOwnerOpen, setAddOwnerOpen] = useState(false);
  const [extraOwnerOptions, setExtraOwnerOptions] = useState<ExtraOption[]>([]);

  const { data: identity } = useGetIdentity<Identity>();
  const isDemo = isDemoAccount(identity?.email);

  const invalidate = useInvalidate();
  const { mutate, mutation } = useCreate();

  const { selectProps, query } = useSelect<GetFieldsFromList<UsersSelectQuery>>(
    {
      resource: "users",
      optionLabel: "name",
      pagination: { mode: "off" },
      filters: buildUserScopeFilters(identity?.id, isDemo),
      meta: { gqlQuery: USERS_SELECT_QUERY },
    },
  );

  const fetchedList = query?.data?.data ? [...query.data.data] : [];
  const hasSelf = identity?.id && fetchedList.some((u) => u.id === identity.id);
  if (identity?.id && identity?.name && !hasSelf) {
    fetchedList.unshift({
      id: identity.id,
      name: identity.name,
      avatarUrl: identity.avatarUrl ?? null,
    } as GetFieldsFromList<UsersSelectQuery>);
  }

  const fetchedOptions: ExtraOption[] = fetchedList.map((user) => ({
    value: user.id,
    searchLabel: user.name,
    label: (
      <SelectOptionWithAvatar
        name={user.name}
        avatarUrl={user.avatarUrl ?? undefined}
      />
    ),
  }));

  const allOwnerOptions = [...extraOwnerOptions, ...fetchedOptions];

  const handleFinish = (values: {
    name: string;
    email: string;
    phone: string;
    jobTitle: string;
    salesOwnerId: string;
    status: string;
  }) => {
    mutate(
      {
        resource: "contacts",
        values: { ...values, companyId },
        meta: { gqlMutation: CREATE_CONTACT_MUTATION },
        successNotification: false,
      },
      {
        onSuccess: () => {
          invalidate({ resource: "contacts", invalidates: ["list"] });
          form.resetFields();
          onCreated();
        },
      },
    );
  };

  return (
    <>
      <Modal
        title="Add Contact"
        open={open}
        onCancel={onClose}
        footer={null}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input placeholder="Full name" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: "Phone is required" }]}
          >
            <PhoneInput defaultCountry="in" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Job Title"
            name="jobTitle"
            rules={[{ required: true, message: "Job title is required" }]}
          >
            <Input placeholder="Job title" />
          </Form.Item>
          <Form.Item
            label="Sales Owner"
            name="salesOwnerId"
            rules={[{ required: true, message: "Sales owner is required" }]}
          >
            <Select
              placeholder="Select or add a sales owner"
              {...selectProps}
              showSearch
              virtual={false}
              filterOption={(input, option) =>
                (option?.searchLabel ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={allOwnerOptions}
              popupRender={(menu) => (
                <>
                  {menu}
                  <Divider style={{ margin: "4px 0" }} />
                  <div
                    style={{
                      padding: "4px 8px",
                      cursor: "pointer",
                      color: "#1677FF",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setAddOwnerOpen(true)}
                  >
                    <PlusOutlined /> Add New Sales Owner
                  </div>
                </>
              )}
            />
          </Form.Item>
          <Form.Item
            label="Stage"
            name="status"
            initialValue="NEW"
            rules={[{ required: true, message: "Stage is required" }]}
          >
            <Select options={statusOptions} placeholder="Select stage" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Button onClick={onClose} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={mutation.isPending}
            >
              Create
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <AddSalesOwnerModal
        open={addOwnerOpen}
        onClose={() => setAddOwnerOpen(false)}
        onCreated={(user) => {
          setExtraOwnerOptions((prev) => [
            {
              value: user.id,
              searchLabel: user.name,
              label: (
                <SelectOptionWithAvatar
                  name={user.name}
                  avatarUrl={user.avatarUrl ?? undefined}
                />
              ),
            },
            ...prev,
          ]);
          form.setFieldValue("salesOwnerId", user.id);
          setAddOwnerOpen(false);
        }}
      />
    </>
  );
};
