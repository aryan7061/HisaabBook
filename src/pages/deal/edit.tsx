import React, { useEffect, useState } from "react";
import {
  Divider,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  Spin,
  message,
} from "antd";
import { Edit, useForm, useSelect } from "@refinedev/antd";
import { HttpError, useGetIdentity, useGo } from "@refinedev/core";
import {
  GetFields,
  GetFieldsFromList,
  GetVariables,
} from "@refinedev/nestjs-query";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import { SelectOptionWithAvatar } from "@/components/select-option-with-avatar";
import { AddSalesOwnerModal } from "@/components/add-sales-owner-modal";
import {
  COMPANIES_SELECT_QUERY,
  CONTACTS_SELECT_QUERY,
  DEAL_QUERY,
  DEAL_STAGES_SELECT_QUERY,
  USERS_SELECT_QUERY,
} from "@/graphql/queries";
import { UPDATE_DEAL_MUTATION } from "@/graphql/mutations";
import {
  CompaniesSelectQuery,
  ContactsSelectQuery,
  DealQuery,
  DealStagesSelectQuery,
  UpdateDealMutationVariables,
  UsersSelectQuery,
} from "@/graphql/types";
import { isDemoAccount } from "@/utilities/helpers";

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

export const EditPage = () => {
  const [checkedOwnership, setCheckedOwnership] = useState(false);
  const [addOwnerOpen, setAddOwnerOpen] = useState(false);
  const [extraOwnerOptions, setExtraOwnerOptions] = useState<ExtraOption[]>([]);

  const go = useGo();
  const { data: identity, isLoading: identityLoading } =
    useGetIdentity<Identity>();
  const isDemo = isDemoAccount(identity?.email);

  const {
    saveButtonProps,
    formProps,
    formLoading,
    query: formQuery,
  } = useForm<
    GetFields<DealQuery>,
    HttpError,
    GetVariables<UpdateDealMutationVariables>
  >({
    redirect: false,
    meta: { gqlQuery: DEAL_QUERY, gqlMutation: UPDATE_DEAL_MUTATION },
  });

  const { createdBy } = formQuery?.data?.data || {};

  useEffect(() => {
    if (formLoading || identityLoading || !formQuery?.data?.data) return;

    // Ownership on Deals now follows createdBy, matching every other
    // resource in the app (Companies, Contacts, Tasks) — changed from
    // dealOwner to keep scoping consistent across the whole project.
    const isOwner = createdBy?.id === identity?.id;

    if (!isDemo && !isOwner) {
      message.warning("You don't have permission to edit this deal.");
      go({ to: { resource: "deals", action: "list" }, type: "replace" });
      return;
    }

    setCheckedOwnership(true);
  }, [
    formLoading,
    identityLoading,
    formQuery?.data?.data,
    isDemo,
    identity?.id,
  ]);

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

  if (formLoading || identityLoading || !checkedOwnership) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "300px",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Edit
      isLoading={formLoading}
      saveButtonProps={saveButtonProps}
      breadcrumb={false}
    >
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Deal title"
          name="title"
          rules={[{ required: true, message: "Deal title is required" }]}
        >
          <Input placeholder="Deal title" />
        </Form.Item>

        <Form.Item
          label="Company"
          name="companyId"
          initialValue={formProps?.initialValues?.company?.id}
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
          initialValue={formProps?.initialValues?.dealOwner?.id}
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

        <Form.Item
          label="Contact"
          name="dealContactId"
          initialValue={formProps?.initialValues?.dealContact?.id}
        >
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
          initialValue={formProps?.initialValues?.stage?.id}
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

        <Form.Item
          label="Expected close date"
          name="closeDate"
          getValueProps={(value) => ({
            value: value ? dayjs(value) : undefined,
          })}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
      </Form>

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
    </Edit>
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
