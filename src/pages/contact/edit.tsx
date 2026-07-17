import { useEffect, useState } from "react";
import CustomAvatar from "@/components/custom-avatar";
import { SelectOptionWithAvatar } from "@/components/select-option-with-avatar";
import { AddSalesOwnerModal } from "@/components/add-sales-owner-modal";
import { statusOptions } from "@/constants";
import { CONTACT_QUERY, USERS_SELECT_QUERY } from "@/graphql/queries";
import { UPDATE_CONTACT_MUTATION } from "@/graphql/mutations";
import {
  ContactQuery,
  UpdateContactMutationVariables,
  UsersSelectQuery,
} from "@/graphql/types";
import { getNameInitials } from "@/utilities";
import { isDemoAccount } from "@/utilities/helpers";
import { Edit, useForm, useSelect } from "@refinedev/antd";
import {
  GetFields,
  GetFieldsFromList,
  GetVariables,
} from "@refinedev/nestjs-query";
import { HttpError, useGetIdentity, useGo } from "@refinedev/core";
import {
  Divider,
  Form,
  Input,
  message,
  Select,
  Spin,
  Tooltip,
  Typography,
} from "antd";
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
    GetFields<ContactQuery>,
    HttpError,
    GetVariables<UpdateContactMutationVariables>
  >({
    redirect: false,
    meta: {
      gqlQuery: CONTACT_QUERY,
      gqlMutation: UPDATE_CONTACT_MUTATION,
    },
  });

  const { avatarUrl, name, createdBy } = formQuery?.data?.data || {};

  useEffect(() => {
    if (formLoading || identityLoading || !formQuery?.data?.data) return;

    const isOwner = createdBy?.id === identity?.id;

    if (!isDemo && !isOwner) {
      message.warning("You don't have permission to edit this contact.");
      go({
        to: { resource: "contacts", action: "list" },
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
    <Edit
      isLoading={formLoading}
      saveButtonProps={saveButtonProps}
      breadcrumb={false}
    >
      <Form {...formProps} layout="vertical">
        <div style={{ marginBottom: "24px" }}>
          <Tooltip title="Contact Photo">
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
          label="Company Name"
          name="companyName"
          rules={[{ required: true, message: "Company name is required" }]}
        >
          <Input placeholder="Company this contact works at" />
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
          label="Stage"
          name="status"
          rules={[{ required: true, message: "Stage is required" }]}
        >
          <Select options={statusOptions} placeholder="Select stage" />
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
          formProps.form?.setFieldValue("salesOwnerId", user.id);
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
