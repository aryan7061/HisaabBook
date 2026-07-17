import { useSearchParams } from "react-router";
import { useState } from "react";

import { useModalForm, useSelect } from "@refinedev/antd";
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
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import { CREATE_DEAL_MUTATION } from "@/graphql/mutations";
import {
  COMPANIES_SELECT_QUERY,
  CONTACTS_SELECT_QUERY,
  USERS_SELECT_QUERY,
} from "@/graphql/queries";
import { UsersSelectQuery } from "@/graphql/types";
import { AddSalesOwnerModal } from "@/components/add-sales-owner-modal";
import { buildUserScopeFilters, isDemoAccount } from "@/utilities/helpers";

type Identity = { id: string; email: string; name: string };

const DealsCreatePage = () => {
  const [searchParams] = useSearchParams();
  const { list } = useNavigation();
  const [addOwnerOpen, setAddOwnerOpen] = useState(false);

  const { data: identity } = useGetIdentity<Identity>();
  const isDemo = isDemoAccount(identity?.email);

  const { formProps, modalProps, close } = useModalForm({
    action: "create",
    defaultVisible: true,
    meta: { gqlMutation: CREATE_DEAL_MUTATION },
  });

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

  return (
    <Modal
      {...modalProps}
      onCancel={() => {
        close();
        list("deals", "replace");
      }}
      title="Add new deal"
      width={512}
    >
      <Form
        {...formProps}
        layout="vertical"
        onFinish={(values: any) => {
          formProps?.onFinish?.({
            ...values,
            closeDate: values.closeDate
              ? dayjs(values.closeDate).toISOString()
              : undefined,
            stageId: searchParams.get("stageId") || null,
          });
        }}
      >
        <Form.Item label="Title" name="title" rules={[{ required: true }]}>
          <Input placeholder="e.g. Website redesign package" />
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
          rules={[{ required: true, message: "Company is required" }]}
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
          rules={[{ required: true, message: "Deal owner is required" }]}
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

export default DealsCreatePage;
