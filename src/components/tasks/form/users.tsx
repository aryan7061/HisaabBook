import { useState } from "react";

import { useForm, useSelect } from "@refinedev/antd";
import { HttpError, useGetIdentity, useInvalidate } from "@refinedev/core";
import {
  GetFields,
  GetFieldsFromList,
  GetVariables,
} from "@refinedev/nestjs-query";

import { Button, Divider, Form, Select, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import {
  UpdateTaskMutation,
  UpdateTaskMutationVariables,
  UsersSelectQuery,
} from "@/graphql/types";

import { USERS_SELECT_QUERY } from "@/graphql/queries";
import { UPDATE_TASK_MUTATION } from "@/graphql/mutations";
import { AddSalesOwnerModal } from "@/components/add-sales-owner-modal";
import { buildUserScopeFilters, isDemoAccount } from "@/utilities/helpers";

type Props = {
  initialValues: {
    userIds?: { label: string; value: string }[];
  };
  cancelForm: () => void;
};

type ExtraOption = { label: string; value: string };
type LabeledValue = { label: string; value: string };

type Identity = {
  id: string;
  email: string;
  name: string;
};

export const UsersForm = ({ initialValues, cancelForm }: Props) => {
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [extraOptions, setExtraOptions] = useState<ExtraOption[]>([]);

  const { data: identity } = useGetIdentity<Identity>();
  const isDemo = isDemoAccount(identity?.email);
  const invalidate = useInvalidate();

  const { formProps, saveButtonProps } = useForm<
    GetFields<UpdateTaskMutation>,
    HttpError,
    Pick<GetVariables<UpdateTaskMutationVariables>, "userIds">
  >({
    queryOptions: {
      enabled: false,
    },
    redirect: false,
    onMutationSuccess: () => {
      // Explicit safety-net invalidation, in addition to Refine's default
      // route-inferred invalidation — ensures the task's assigned users
      // list refreshes immediately after saving, even if resource/id
      // inference from the route didn't resolve as expected.
      invalidate({ resource: "tasks", invalidates: ["list", "detail"] });
      cancelForm();
    },
    meta: {
      gqlMutation: UPDATE_TASK_MUTATION,
    },
  });

  const { selectProps } = useSelect<GetFieldsFromList<UsersSelectQuery>>({
    resource: "users",
    meta: {
      gqlQuery: USERS_SELECT_QUERY,
    },
    optionLabel: "name",
    filters: buildUserScopeFilters(identity?.id, isDemo),
  });

  const fetchedOptions: ExtraOption[] =
    (selectProps.options as ExtraOption[]) ?? [];

  const hasSelf =
    identity?.id && fetchedOptions.some((o) => o.value === identity.id);
  const selfOption: ExtraOption[] =
    identity?.id && identity?.name && !hasSelf
      ? [{ label: identity.name, value: identity.id }]
      : [];

  const allOptions: ExtraOption[] = [
    ...extraOptions,
    ...selfOption,
    ...fetchedOptions,
  ];

  const handleFinish = (values: any) => {
    const userIds = (values.userIds ?? []).map(
      (entry: LabeledValue) => entry.value,
    );
    formProps.onFinish?.({ userIds });
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "end",
        justifyContent: "space-between",
        gap: "12px",
      }}
    >
      <Form
        {...formProps}
        style={{ width: "100%" }}
        initialValues={initialValues}
        onFinish={handleFinish}
      >
        <Form.Item noStyle name="userIds">
          <Select
            {...selectProps}
            labelInValue
            className="kanban-users-form-select"
            styles={{ popup: { root: { padding: "0px" } } }}
            style={{ width: "100%" }}
            mode="multiple"
            virtual={false}
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
                  onClick={() => setAddUserOpen(true)}
                >
                  <PlusOutlined /> Add New User
                </div>
              </>
            )}
          />
        </Form.Item>
      </Form>
      <Space>
        <Button type="default" onClick={cancelForm}>
          Cancel
        </Button>
        <Button {...saveButtonProps} type="primary">
          Save
        </Button>
      </Space>

      <AddSalesOwnerModal
        title="Add New User"
        open={addUserOpen}
        onClose={() => setAddUserOpen(false)}
        onCreated={(user) => {
          const newOption: ExtraOption = { label: user.name, value: user.id };
          setExtraOptions((prev) => [newOption, ...prev]);

          const currentValue: LabeledValue[] =
            formProps.form?.getFieldValue("userIds") ?? [];
          formProps.form?.setFieldValue("userIds", [
            ...currentValue,
            newOption,
          ]);

          setAddUserOpen(false);
        }}
      />
    </div>
  );
};
