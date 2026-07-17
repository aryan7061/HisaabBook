import React, { useState } from "react";
import { DealList } from "./list";
import {
  Divider,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Modal,
  Select,
} from "antd";
import { useModalForm, useSelect } from "@refinedev/antd";
import { useGetIdentity, useGo, useInvalidate } from "@refinedev/core";
import { CREATE_DEAL_MUTATION } from "@/graphql/mutations";
import {
  COMPANIES_SELECT_QUERY,
  CONTACTS_SELECT_QUERY,
  DEAL_STAGES_SELECT_QUERY,
  USERS_SELECT_QUERY,
} from "@/graphql/queries";
import { SelectOptionWithAvatar } from "@/components/select-option-with-avatar";
import { AddSalesOwnerModal } from "@/components/add-sales-owner-modal";
import {
  CompaniesSelectQuery,
  ContactsSelectQuery,
  DealStagesSelectQuery,
  UsersSelectQuery,
} from "@/graphql/types";
import { GetFieldsFromList } from "@refinedev/nestjs-query";
import { isDemoAccount } from "@/utilities/helpers";
import { PlusOutlined } from "@ant-design/icons";

type Identity = {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
};

type ExtraOption = {
  value: string;
  label: React.ReactNode;
  searchLabel: string;
};

export const Create = () => {
  const go = useGo();
  const invalidate = useInvalidate();
  const [addOwnerOpen, setAddOwnerOpen] = useState(false);
  const [extraOwnerOptions, setExtraOwnerOptions] = useState<ExtraOption[]>([]);

  const { data: identity } = useGetIdentity<Identity>();
  const isDemo = isDemoAccount(identity?.email);

  const goToListPage = () => {
    invalidate({ resource: "deals", invalidates: ["list"] });
    go({
      to: { resource: "deals", action: "list" },
      options: { keepQuery: true },
      type: "replace",
    });
  };

  const { formProps, modalProps } = useModalForm({
    action: "create",
    defaultVisible: true,
    resource: "deals",
    redirect: false,
    mutationMode: "pessimistic",
    onMutationSuccess: goToListPage,
    meta: { gqlMutation: CREATE_DEAL_MUTATION },
  });

  const { selectProps: companySelectProps } = useSelect<
    GetFieldsFromList<CompaniesSelectQuery>
  >({
    resource: "companies",
    optionLabel: "name",
    pagination: { mode: "off" },
    filters: isDemo
      ? []
      : [{ field: "createdBy.id", operator: "eq", value: identity?.id }],
    meta: { gqlQuery: COMPANIES_SELECT_QUERY },
  });

  const { selectProps: contactSelectProps } = useSelect<
    GetFieldsFromList<ContactsSelectQuery>
  >({
    resource: "contacts",
    optionLabel: "name",
    pagination: { mode: "off" },
    filters: isDemo
      ? []
      : [{ field: "createdBy.id", operator: "eq", value: identity?.id }],
    meta: { gqlQuery: CONTACTS_SELECT_QUERY },
  });

  const { selectProps: stageSelectProps } = useSelect<
    GetFieldsFromList<DealStagesSelectQuery>
  >({
    resource: "dealStages",
    optionLabel: "title",
    pagination: { mode: "off" },
    filters: [
      {
        field: "title",
        operator: "in",
        value: ["NEW LEAD", "NEGOTIATION", "WON", "LOST"],
      },
    ],
    meta: { gqlQuery: DEAL_STAGES_SELECT_QUERY },
  });

  const { selectProps: ownerSelectProps, query: ownerQuery } = useSelect<
    GetFieldsFromList<UsersSelectQuery>
  >({
    resource: "users",
    optionLabel: "name",
    pagination: { mode: "off" },
    filters: [],
    meta: { gqlQuery: USERS_SELECT_QUERY },
  });

  const fetchedOwnerOptions: ExtraOption[] = buildOwnerOptions(
    ownerQuery?.data?.data,
    identity,
  );
  const allOwnerOptions = [...extraOwnerOptions, ...fetchedOwnerOptions];

  return (
    <DealList>
      <Modal
        {...modalProps}
        onCancel={goToListPage}
        title="Create Deal"
        width={560}
      >
        <Form {...formProps} layout="vertical">
          <Form.Item
            label="Deal title"
            name="title"
            rules={[{ required: true, message: "Deal title is required" }]}
          >
            <Input placeholder="e.g. Website redesign package" />
          </Form.Item>

          <Form.Item
            label="Company"
            name="companyId"
            rules={[{ required: true, message: "Company is required" }]}
          >
            <Select
              placeholder="Select company"
              {...companySelectProps}
              showSearch
              virtual={false}
            />
          </Form.Item>

          <Form.Item
            label="Sales owner"
            name="dealOwnerId"
            rules={[{ required: true, message: "Sales owner is required" }]}
          >
            <Select
              placeholder="Select or add a sales owner"
              {...ownerSelectProps}
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
                    <PlusOutlined /> Add new sales owner
                  </div>
                </>
              )}
            />
          </Form.Item>

          <Form.Item label="Contact" name="dealContactId">
            <Select
              placeholder="Select contact (optional)"
              {...contactSelectProps}
              showSearch
              virtual={false}
              allowClear
            />
          </Form.Item>

          <Form.Item
            label="Stage"
            name="stageId"
            rules={[{ required: true, message: "Stage is required" }]}
          >
            <Select placeholder="Select stage" {...stageSelectProps} />
          </Form.Item>

          <Form.Item label="Deal value" name="value">
            <InputNumber
              prefix="₹"
              min={0}
              placeholder="0.00"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item label="Expected close date" name="closeDate">
            <DatePicker style={{ width: "100%" }} />
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
          formProps.form?.setFieldValue("dealOwnerId", user.id);
          setAddOwnerOpen(false);
        }}
      />
    </DealList>
  );
};

function buildOwnerOptions(
  users: GetFieldsFromList<UsersSelectQuery>[] | undefined,
  identity: Identity | undefined,
): ExtraOption[] {
  const list = users ? [...users] : [];

  const hasSelf = identity?.id && list.some((u) => u.id === identity.id);
  if (identity?.id && identity?.name && !hasSelf) {
    list.unshift({
      id: identity.id,
      name: identity.name,
      avatarUrl: identity.avatarUrl ?? null,
    } as GetFieldsFromList<UsersSelectQuery>);
  }

  return list.map((user) => ({
    value: user.id,
    searchLabel: user.name,
    label: (
      <SelectOptionWithAvatar
        name={user.name}
        avatarUrl={user.avatarUrl ?? undefined}
      />
    ),
  }));
}
