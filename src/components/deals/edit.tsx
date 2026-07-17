import React, { useState } from "react";

import { DeleteButton, useModalForm, useSelect } from "@refinedev/antd";
import { useGetIdentity, useNavigation } from "@refinedev/core";
import { GetFieldsFromList } from "@refinedev/nestjs-query";

import {
  Divider,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Modal,
  Select,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import { Deal } from "@/graphql/schema.types";
import { DEAL_QUERY } from "@/graphql/queries";
import { UPDATE_DEAL_MUTATION } from "@/graphql/mutations";
import {
  COMPANIES_SELECT_QUERY,
  CONTACTS_SELECT_QUERY,
  USERS_SELECT_QUERY,
} from "@/graphql/queries";
import { UsersSelectQuery } from "@/graphql/types";
import { AddSalesOwnerModal } from "@/components/add-sales-owner-modal";
import { buildUserScopeFilters, isDemoAccount } from "@/utilities/helpers";

type Identity = { id: string; email: string; name: string };

const DealsEditPage = () => {
  const [addOwnerOpen, setAddOwnerOpen] = useState(false);
  const [checkedOwnership, setCheckedOwnership] = useState(false);

  const { list } = useNavigation();
  const { data: identity, isLoading: identityLoading } =
    useGetIdentity<Identity>();
  const isDemo = isDemoAccount(identity?.email);

  const { modalProps, close, query, formProps } = useModalForm<Deal>({
    action: "edit",
    defaultVisible: true,
    meta: { gqlQuery: DEAL_QUERY, gqlMutation: UPDATE_DEAL_MUTATION },
  });

  const dealData = query?.data?.data;
  const queryLoading = query?.isLoading ?? true;

  React.useEffect(() => {
    if (queryLoading || identityLoading || !dealData) return;

    const isOwner = dealData.dealOwner?.id === identity?.id;
    if (!isDemo && !isOwner) {
      message.warning("You don't have permission to view this deal.");
      close();
      list("deals", "replace");
      return;
    }
    setCheckedOwnership(true);
  }, [queryLoading, identityLoading, dealData, isDemo, identity?.id]);

  const { selectProps: companySelectProps } = useSelect({
    resource: "companies",
    optionLabel: "name",
    meta: { gqlQuery: COMPANIES_SELECT_QUERY },
  });

  const { selectProps: contactSelectProps } = useSelect({
    resource: "contacts",
    optionLabel: "name",
    meta: { gqlQuery: CONTACTS_SELECT_QUERY },
  });

  const { selectProps: ownerSelectProps } = useSelect<
    GetFieldsFromList<UsersSelectQuery>
  >({
    resource: "users",
    optionLabel: "name",
    filters: buildUserScopeFilters(identity?.id, isDemo),
    meta: { gqlQuery: USERS_SELECT_QUERY },
  });

  const isLoading = queryLoading || identityLoading || !checkedOwnership;

  return (
    <Modal
      {...modalProps}
      onCancel={() => {
        close();
        list("deals", "replace");
      }}
      title="Edit deal"
      width={512}
      confirmLoading={isLoading}
      footer={
        <DeleteButton type="link" onSuccess={() => list("deals", "replace")}>
          Delete deal
        </DeleteButton>
      }
    >
      <Form
        {...formProps}
        layout="vertical"
        initialValues={
          dealData
            ? {
                title: dealData.title,
                value: dealData.value,
                closeDate: dealData.closeDate
                  ? dayjs(dealData.closeDate)
                  : undefined,
                companyId: dealData.companyId,
                dealContactId: dealData.dealContactId,
                dealOwnerId: dealData.dealOwnerId,
              }
            : undefined
        }
        onFinish={(values: any) => {
          formProps?.onFinish?.({
            ...values,
            closeDate: values.closeDate
              ? dayjs(values.closeDate).toISOString()
              : null,
          });
        }}
      >
        <Form.Item label="Title" name="title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Value" name="value">
          <InputNumber prefix="₹" min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Expected Close Date" name="closeDate">
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Company"
          name="companyId"
          rules={[{ required: true }]}
        >
          <Select {...companySelectProps} placeholder="Select company" />
        </Form.Item>

        <Form.Item label="Contact" name="dealContactId">
          <Select
            {...contactSelectProps}
            allowClear
            placeholder="Select contact (optional)"
          />
        </Form.Item>

        <Form.Item
          label="Deal Owner"
          name="dealOwnerId"
          rules={[{ required: true }]}
        >
          <Select
            {...ownerSelectProps}
            placeholder="Select or add a deal owner"
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
                  <PlusOutlined /> Add New Deal Owner
                </div>
              </>
            )}
          />
        </Form.Item>
      </Form>

      <AddSalesOwnerModal
        title="Add New Deal Owner"
        open={addOwnerOpen}
        onClose={() => setAddOwnerOpen(false)}
        onCreated={(user) => {
          formProps.form?.setFieldValue("dealOwnerId", user.id);
          setAddOwnerOpen(false);
        }}
      />
    </Modal>
  );
};

export default DealsEditPage;
