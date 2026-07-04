import React from "react";
import { CompanyList } from "./list";
import { Form, Input, Modal, Select } from "antd";
import { useModalForm, useSelect } from "@refinedev/antd";
import { useGo } from "@refinedev/core";
import { CREATE_COMPANY_MUTATION } from "@/graphql/mutations";
import { USERS_SELECT_QUERY } from "@/graphql/queries";
import { SelectOptionWithAvatar } from "@/components/select-option-with-avatar";
import { UsersSelectQuery } from "@/graphql/types";
import { GetFieldsFromList } from "@refinedev/nestjs-query";

export const Create = () => {
  const go = useGo();

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
      meta: {
        gqlQuery: USERS_SELECT_QUERY,
      },
    },
  );

  return (
    <CompanyList>
      <Modal
        {...modalProps}
        mask={true}
        onCancel={goToListPage}
        title="Create Company"
        width={512}
      >
        <Form {...formProps} layout="vertical">
          <Form.Item
            label="Company Name"
            name="name"
            rules={[{ required: true, message: "Company name is required" }]}
          >
            <Input placeholder="Enter company name" />
          </Form.Item>
          <Form.Item
            label="Sales Owner"
            name="salesOwnerId"
            rules={[{ required: true, message: "Sales owner is required" }]}
          >
            <Select
              placeholder="Select sales owner"
              {...selectProps}
              options={
                query?.data?.data.map(
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
        </Form>
      </Modal>
    </CompanyList>
  );
};
