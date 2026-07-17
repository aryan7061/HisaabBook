import CustomAvatar from "@/components/custom-avatar";
import { SelectOptionWithAvatar } from "@/components/select-option-with-avatar";
import { AddSalesOwnerModal } from "@/components/add-sales-owner-modal";
import {
  businessTypeOptions,
  companySizeOptions,
  countryOptions,
} from "@/constants";
import { COMPANY_QUERY, USERS_SELECT_QUERY } from "@/graphql/queries";
import { UPDATE_COMPANY_MUTATION } from "@/graphql/mutations";
import {
  CompanyQuery,
  UpdateCompanyMutationVariables,
  UsersSelectQuery,
} from "@/graphql/types";
import { getNameInitials } from "@/utilities";
import { buildUserScopeFilters, isDemoAccount } from "@/utilities/helpers";
import {
  Edit,
  useForm,
  useSelect,
  useThemedLayoutContext,
} from "@refinedev/antd";
import {
  GetFields,
  GetFieldsFromList,
  GetVariables,
} from "@refinedev/nestjs-query";
import { HttpError, useGetIdentity, useGo } from "@refinedev/core";
import {
  Button,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Select,
  Spin,
  Tooltip,
  Typography,
} from "antd";
import { LinkOutlined, PlusOutlined, TeamOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

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

export const EditPage = () => {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [checkedOwnership, setCheckedOwnership] = useState(false);
  const [addOwnerOpen, setAddOwnerOpen] = useState(false);
  const [extraOwnerOptions, setExtraOwnerOptions] = useState<ExtraOption[]>([]);

  const go = useGo();
  const { data: identity, isLoading: identityLoading } =
    useGetIdentity<Identity>();
  const isDemo = isDemoAccount(identity?.email);

  const { setSiderCollapsed } = useThemedLayoutContext();

  useEffect(() => {
    setSiderCollapsed(true);
    return () => setSiderCollapsed(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    saveButtonProps,
    formProps,
    formLoading,
    query: formQuery,
  } = useForm<
    GetFields<CompanyQuery>,
    HttpError,
    GetVariables<UpdateCompanyMutationVariables>
  >({
    redirect: false,
    meta: {
      gqlQuery: COMPANY_QUERY,
      gqlMutation: UPDATE_COMPANY_MUTATION,
    },
  });

  const { avatarUrl, name, createdBy } = formQuery?.data?.data || {};

  useEffect(() => {
    if (formQuery?.data?.data?.website) {
      setWebsiteUrl(formQuery.data.data.website);
    }
  }, [formQuery?.data?.data?.website]);

  useEffect(() => {
    if (formLoading || identityLoading || !formQuery?.data?.data) return;

    const isOwner = createdBy?.id === identity?.id;

    if (!isDemo && !isOwner) {
      message.warning("You don't have permission to edit this company.");
      go({
        to: { resource: "companies", action: "list" },
        type: "replace",
      });
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

  const { selectProps, query: usersQuery } = useSelect<
    GetFieldsFromList<UsersSelectQuery>
  >({
    resource: "users",
    optionLabel: "name",
    pagination: {
      mode: "off",
    },
    filters: [],
    meta: {
      gqlQuery: USERS_SELECT_QUERY,
    },
  });

  const fetchedOptions: ExtraOption[] = buildOwnerOptions(
    usersQuery?.data?.data,
    identity,
  );

  const allOwnerOptions = [...extraOwnerOptions, ...fetchedOptions];

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
    <div>
      <Edit
        isLoading={formLoading}
        saveButtonProps={saveButtonProps}
        breadcrumb={false}
        headerButtons={() =>
          name ? (
            <Button
              icon={<TeamOutlined />}
              onClick={() =>
                go({ to: `/contacts?company=${encodeURIComponent(name)}` })
              }
            >
              View Contacts
            </Button>
          ) : null
        }
      >
        <Form {...formProps} layout="vertical">
          <div style={{ marginBottom: "24px" }}>
            <Tooltip title="Company Logo">
              <CustomAvatar
                shape="square"
                src={avatarUrl}
                name={getNameInitials(name || "")}
                style={{
                  width: 96,
                  height: 96,
                }}
              />
            </Tooltip>
          </div>

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
            <Input placeholder="Company name" />
          </Form.Item>

          <Form.Item
            label="Sales Owner"
            name="salesOwnerId"
            initialValue={formProps?.initialValues?.salesOwner?.id}
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
              suffix={
                websiteUrl ? (
                  <Tooltip title="Open website">
                    <LinkOutlined
                      style={{ color: "#1677FF", cursor: "pointer" }}
                      onClick={() =>
                        window.open(websiteUrl, "_blank", "noopener")
                      }
                    />
                  </Tooltip>
                ) : (
                  <LinkOutlined style={{ color: "#d9d9d9" }} />
                )
              }
            />
          </Form.Item>
        </Form>
      </Edit>

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
    </div>
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
