import CustomAvatar from "@/components/custom-avatar";
import { SelectOptionWithAvatar } from "@/components/select-option-with-avatar";
import {
  businessTypeOptions,
  companySizeOptions,
  industryOptions,
} from "@/constants";
import { UPDATE_COMPANY_MUTATION } from "@/graphql/mutations";
import { USERS_SELECT_QUERY } from "@/graphql/queries";
import { UsersSelectQuery } from "@/graphql/types";
import { getNameInitials } from "@/utilities";
import { Edit, useForm, useSelect } from "@refinedev/antd";
import { GetFieldsFromList } from "@refinedev/nestjs-query";
import {
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Tooltip,
  Typography,
} from "antd";
import { CompanyContactsTable } from "./contacts-table";
import { LinkOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

const { Title } = Typography;

const countryOptions = [
  { label: "Afghanistan", value: "Afghanistan" },
  { label: "Australia", value: "Australia" },
  { label: "Bangladesh", value: "Bangladesh" },
  { label: "Brazil", value: "Brazil" },
  { label: "Canada", value: "Canada" },
  { label: "China", value: "China" },
  { label: "France", value: "France" },
  { label: "Germany", value: "Germany" },
  { label: "India", value: "India" },
  { label: "Indonesia", value: "Indonesia" },
  { label: "Italy", value: "Italy" },
  { label: "Japan", value: "Japan" },
  { label: "Mexico", value: "Mexico" },
  { label: "Netherlands", value: "Netherlands" },
  { label: "New Zealand", value: "New Zealand" },
  { label: "Nigeria", value: "Nigeria" },
  { label: "Pakistan", value: "Pakistan" },
  { label: "Russia", value: "Russia" },
  { label: "Saudi Arabia", value: "Saudi Arabia" },
  { label: "Singapore", value: "Singapore" },
  { label: "South Africa", value: "South Africa" },
  { label: "South Korea", value: "South Korea" },
  { label: "Spain", value: "Spain" },
  { label: "Sweden", value: "Sweden" },
  { label: "Turkey", value: "Turkey" },
  { label: "United Arab Emirates", value: "United Arab Emirates" },
  { label: "United Kingdom", value: "United Kingdom" },
  { label: "United States", value: "United States" },
];

export const EditPage = () => {
  const [websiteUrl, setWebsiteUrl] = useState("");

  const {
    saveButtonProps,
    formProps,
    formLoading,
    query: formQuery,
  } = useForm({
    redirect: false,
    meta: {
      gqlMutation: UPDATE_COMPANY_MUTATION,
    },
  });

  const { avatarUrl, name } = formQuery?.data?.data || {};

  useEffect(() => {
    if (formQuery?.data?.data?.website) {
      setWebsiteUrl(formQuery.data.data.website);
    }
  }, [formQuery?.data?.data?.website]);

  const { selectProps, query: usersQuery } = useSelect<
    GetFieldsFromList<UsersSelectQuery>
  >({
    resource: "users",
    optionLabel: "name",
    pagination: {
      mode: "off",
    },
    meta: {
      gqlQuery: USERS_SELECT_QUERY,
    },
  });

  return (
    <div>
      <Row gutter={[32, 31]}>
        <Col xs={24} md={12}>
          <Edit
            isLoading={formLoading}
            saveButtonProps={saveButtonProps}
            breadcrumb={false}
          >
            <Form {...formProps} layout="vertical">
              {/* Read-only Company Avatar */}
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
                  placeholder="Select sales owner"
                  {...selectProps}
                  options={
                    usersQuery?.data?.data.map(
                      (user: GetFieldsFromList<UsersSelectQuery>) => ({
                        value: user.id,
                        label: (
                          <SelectOptionWithAvatar
                            name={user.name}
                            avatarUrl={user.avatarUrl ?? undefined}
                          />
                        ),
                      }),
                    ) ?? []
                  }
                />
              </Form.Item>

              <Form.Item
                label="Company Size"
                name="companySize"
                rules={[
                  { required: true, message: "Company size is required" },
                ]}
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
                <Select
                  options={industryOptions}
                  placeholder="Select industry"
                />
              </Form.Item>

              <Form.Item
                label="Business Type"
                name="businessType"
                rules={[
                  { required: true, message: "Business type is required" },
                ]}
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
                    message:
                      "Please enter a valid URL (e.g. https://example.com)",
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
        </Col>

        <Col xs={24} xl={12}>
          <CompanyContactsTable />
        </Col>
      </Row>
    </div>
  );
};
