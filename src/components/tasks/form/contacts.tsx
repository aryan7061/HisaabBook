import { useForm, useSelect } from "@refinedev/antd";
import { HttpError, useGetIdentity, useInvalidate } from "@refinedev/core";
import {
  GetFields,
  GetFieldsFromList,
  GetVariables,
} from "@refinedev/nestjs-query";

import { Button, Form, Select, Space } from "antd";

import {
  UpdateTaskMutation,
  UpdateTaskMutationVariables,
  ContactsSelectQuery,
} from "@/graphql/types";

import { CONTACTS_SELECT_QUERY } from "@/graphql/queries";
import { UPDATE_TASK_MUTATION } from "@/graphql/mutations";
import { isDemoAccount } from "@/utilities/helpers";

type Props = {
  initialValues: {
    contactIds?: { label: string; value: string }[];
  };
  cancelForm: () => void;
};

type LabeledValue = { label: string; value: string };

type Identity = {
  id: string;
  email: string;
};

export const ContactsForm = ({ initialValues, cancelForm }: Props) => {
  const { data: identity } = useGetIdentity<Identity>();
  const isDemo = isDemoAccount(identity?.email);
  const invalidate = useInvalidate();

  const { formProps, saveButtonProps } = useForm<
    GetFields<UpdateTaskMutation>,
    HttpError,
    Pick<GetVariables<UpdateTaskMutationVariables>, "contactIds">
  >({
    queryOptions: {
      enabled: false,
    },
    redirect: false,
    onMutationSuccess: () => {
      invalidate({ resource: "tasks", invalidates: ["list", "detail"] });
      cancelForm();
    },
    meta: {
      gqlMutation: UPDATE_TASK_MUTATION,
    },
  });

  const { selectProps } = useSelect<GetFieldsFromList<ContactsSelectQuery>>({
    resource: "contacts",
    meta: {
      gqlQuery: CONTACTS_SELECT_QUERY,
    },
    optionLabel: "name",
    filters: isDemo
      ? []
      : [{ field: "createdBy.id", operator: "eq", value: identity?.id }],
  });

  const handleFinish = (values: any) => {
    const contactIds = (values.contactIds ?? []).map(
      (entry: LabeledValue) => entry.value,
    );
    formProps.onFinish?.({ contactIds });
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
        <Form.Item noStyle name="contactIds">
          <Select
            {...selectProps}
            labelInValue
            style={{ width: "100%" }}
            mode="multiple"
            virtual={false}
            placeholder="Select contacts"
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
    </div>
  );
};
