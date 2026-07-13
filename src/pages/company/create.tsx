import React, { useState } from "react";
import { CompanyList } from "./list";
import {
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Typography,
} from "antd";
import { useModalForm, useSelect } from "@refinedev/antd";
import { useGetIdentity, useGo } from "@refinedev/core";
import { CREATE_COMPANY_MUTATION } from "@/graphql/mutations";
import { USERS_SELECT_QUERY } from "@/graphql/queries";
import { SelectOptionWithAvatar } from "@/components/select-option-with-avatar";
import { AddSalesOwnerModal } from "@/components/add-sales-owner-modal";
import { UsersSelectQuery } from "@/graphql/types";
import { GetFieldsFromList } from "@refinedev/nestjs-query";
import {
  businessTypeOptions,
  companySizeOptions,
  countryOptions,
  industryOptions,
} from "@/constants";
import { buildUserScopeFilters, isDemoAccount } from "@/utilities/helpers";
import { PlusOutlined } from "@ant-design/icons";

const { Title } = Typography;

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
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [addOwnerOpen, setAddOwnerOpen] = useState(false);
  const [extraOwnerOptions, setExtraOwnerOptions] = useState<ExtraOption[]>([]);

  const { data: identity } = useGetIdentity<Identity>();
  const isDemo = isDemoAccount(identity?.email);

  const goToListPage = () => {
    go({
      to: {
        resource: "companies",
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
    resource: "companies",
    redirect: false,
    mutationMode: "pessimistic",
    onMutationSuccess: goToListPage,
    meta: {
      gqlMutation: CREATE_COMPANY_MUTATION,
    },
  });

  const { selectProps, query } = useSelect<GetFieldsFromList<UsersSelectQuery>>(
    {
      resource: "users",
      optionLabel: "name",
      pagination: {
        mode: "off",
      },
      filters: buildUserScopeFilters(identity?.id, isDemo),
      meta: {
        gqlQuery: USERS_SELECT_QUERY,
      },
    },
  );

  const fetchedOptions: ExtraOption[] = buildOwnerOptions(
    query?.data?.data,
    identity,
  );

  const allOptions = [...extraOwnerOptions, ...fetchedOptions];

  return (
    <CompanyList>
      <Modal
        {...modalProps}
        onCancel={goToListPage}
        title="Create Company"
        width={600}
      >
        <Form {...formProps} layout="vertical">
          <Divider orientation="left" orientationMargin={0}>
            <Title level={5} style={{ margin: 0, color: "#8c8c8c" }}>
              Company Info
            </Title>
          </Divider>

          <Form.Item
            label="Company Name"
            name="name"
            rules={[
              { required: true, message: "Company name is required" },
              { min: 2, message: "Name must be at least 2 characters" },
            ]}
          >
            <Input placeholder="Enter company name" />
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
            label="Company Size"
            name="companySize"
            rules={[{ required: true, message: "Company size is required" }]}
          >
            <Select
              options={companySizeOptions}
              placeholder="Select company size"
            />
          </Form.Item>

          <Divider orientation="left" orientationMargin={0}>
            <Title level={5} style={{ margin: 0, color: "#8c8c8c" }}>
              Financial Info
            </Title>
          </Divider>

          <Form.Item
            label="Total Revenue"
            name="totalRevenue"
            rules={[
              { required: true, message: "Total revenue is required" },
              {
                type: "number",
                min: 0,
                message: "Revenue must be a positive number",
              },
            ]}
          >
            <InputNumber
              prefix="₹"
              min={0}
              placeholder="0.00"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            label="Industry"
            name="industry"
            rules={[{ required: true, message: "Industry is required" }]}
          >
            <Select options={industryOptions} placeholder="Select industry" />
          </Form.Item>

          <Form.Item
            label="Business Type"
            name="businessType"
            rules={[{ required: true, message: "Business type is required" }]}
          >
            <Select
              options={businessTypeOptions}
              placeholder="Select business type"
            />
          </Form.Item>

          <Divider orientation="left" orientationMargin={0}>
            <Title level={5} style={{ margin: 0, color: "#8c8c8c" }}>
              Contact Info
            </Title>
          </Divider>

          <Form.Item
            label="Country"
            name="country"
            rules={[{ required: true, message: "Country is required" }]}
          >
            <Select
              showSearch
              placeholder="Select country"
              options={countryOptions}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </Form.Item>

          <Form.Item
            label="Website"
            name="website"
            rules={[
              {
                type: "url",
                message: "Please enter a valid URL (e.g. https://example.com)",
              },
            ]}
          >
            <Input
              placeholder="https://example.com"
              onChange={(e) => setWebsiteUrl(e.target.value)}
            />
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
          formProps.form?.setFieldValue("salesOwnerId", user.id);
          setAddOwnerOpen(false);
        }}
      />
    </CompanyList>
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
