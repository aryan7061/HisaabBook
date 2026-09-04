import React, { useState } from "react";
import { ContactList } from "./list";
import { Divider, Form, Input, Modal, Select } from "antd";
import { useModalForm, useSelect } from "@refinedev/antd";
import { useGetIdentity, useGo, useInvalidate } from "@refinedev/core";
import { CREATE_CONTACT_MUTATION } from "@/graphql/mutations";
import { COMPANIES_SELECT_QUERY, USERS_SELECT_QUERY } from "@/graphql/queries";
import { SelectOptionWithAvatar } from "@/components/select-option-with-avatar";
import { AddSalesOwnerModal } from "@/components/add-sales-owner-modal";
import { AddCompanyModal } from "@/components/add-company-modal";
import { CompaniesSelectQuery, UsersSelectQuery } from "@/graphql/types";
import { GetFieldsFromList } from "@refinedev/nestjs-query";
import { statusOptions } from "@/constants";
import { PlusOutlined } from "@ant-design/icons";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

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

type CompanyOption = {
  value: string;
  label: string;
};

export const Create = () => {
  const go = useGo();
  const invalidate = useInvalidate();
  const [addOwnerOpen, setAddOwnerOpen] = useState(false);
  const [addCompanyOpen, setAddCompanyOpen] = useState(false);
  const [extraOwnerOptions, setExtraOwnerOptions] = useState<ExtraOption[]>([]);
  const [extraCompanyOptions, setExtraCompanyOptions] = useState<
    CompanyOption[]
  >([]);

  const { data: identity } = useGetIdentity<Identity>();

  const goToListPage = () => {
    invalidate({ resource: "contacts", invalidates: ["list"] });
    go({
      to: {
        resource: "contacts",
        action: "list",
      },
      options: {
        keepQuery: true,
      },
      type: "replace",
    });
  };

  const { formProps, modalProps } = useModalForm({
    action: "create",
    defaultVisible: true,
    resource: "contacts",
    redirect: false,
    mutationMode: "pessimistic",
    onMutationSuccess: goToListPage,
    meta: {
      gqlMutation: CREATE_CONTACT_MUTATION,
    },
  });

  const { selectProps, query } = useSelect<GetFieldsFromList<UsersSelectQuery>>(
    {
      resource: "users",
      optionLabel: "name",
      pagination: {
        mode: "off",
      },
      filters: [],
      meta: {
        gqlQuery: USERS_SELECT_QUERY,
      },
    },
  );

  const { query: companiesQuery } = useSelect<
    GetFieldsFromList<CompaniesSelectQuery>
  >({
    resource: "companies",
    optionLabel: "name",
    optionValue: "name",
    pagination: {
      mode: "off",
    },
    filters: [],
    meta: {
      gqlQuery: COMPANIES_SELECT_QUERY,
    },
  });

  const fetchedOptions: ExtraOption[] = buildOwnerOptions(
    query?.data?.data,
    identity,
  );

  const allOptions = [...extraOwnerOptions, ...fetchedOptions];

  const companyOptions = buildCompanyOptions(
    companiesQuery?.data?.data,
    extraCompanyOptions,
  );

  return (
    <ContactList>
      <Modal
        {...modalProps}
        onCancel={goToListPage}
        title="Create Contact"
        width={600}
      >
        <Form {...formProps} layout="vertical">
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
            className="hb-phone-input"
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
            label="Company Name"
            name="companyName"
            rules={[{ required: true, message: "Company name is required" }]}
          >
            <Select
              placeholder="Select or add a company"
              showSearch
              virtual={false}
              onSearch={undefined}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toString()
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={companyOptions}
              popupRender={(menu) => (
                <>
                  {menu}
                  <Divider style={{ margin: "var(--hb-space-1) 0" }} />
                  <div
                    className="hb-inline-action"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setAddCompanyOpen(true)}
                  >
                    <PlusOutlined /> Add New Company
                  </div>
                </>
              )}
            />
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
              options={allOptions}
              popupRender={(menu) => (
                <>
                  {menu}
                  <Divider style={{ margin: "var(--hb-space-1) 0" }} />
                  <div
                    className="hb-inline-action"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setAddOwnerOpen(true)}
                  >
                    <PlusOutlined /> Add New Sales Owner
                  </div>
                </>
              )}
            />
          </Form.Item>

          <Form.Item label="Stage" name="status" initialValue="NEW">
            <Select options={statusOptions} placeholder="Select stage" />
          </Form.Item>
        </Form>
      </Modal>

      <AddCompanyModal
        open={addCompanyOpen}
        onClose={() => setAddCompanyOpen(false)}
        onCreated={(company) => {
          setExtraCompanyOptions((prev) => [
            { value: company.name, label: company.name },
            ...prev,
          ]);
          formProps.form?.setFieldValue("companyName", company.name);
          setAddCompanyOpen(false);
        }}
      />

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
          formProps.form?.setFieldValue("salesOwnerId", user.id);
          setAddOwnerOpen(false);
        }}
      />
    </ContactList>
  );
};

function buildCompanyOptions(
  companies: GetFieldsFromList<CompaniesSelectQuery>[] | undefined,
  extra: CompanyOption[],
): CompanyOption[] {
  const seen = new Set<string>();
  const options: CompanyOption[] = [];

  for (const option of extra) {
    if (seen.has(option.value)) continue;
    seen.add(option.value);
    options.push(option);
  }

  for (const company of companies ?? []) {
    if (seen.has(company.name)) continue;
    seen.add(company.name);
    options.push({ value: company.name, label: company.name });
  }

  return options;
}

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

  const sorted = list.sort((a, b) => {
    if (a.id === identity?.id) return -1;
    if (b.id === identity?.id) return 1;
    return 0;
  });

  return sorted.map((user) => ({
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
