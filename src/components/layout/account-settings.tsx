import { SaveButton, useForm } from "@refinedev/antd";
import { HttpError, useGetIdentity } from "@refinedev/core";
import { GetFields, GetVariables } from "@refinedev/nestjs-query";

import { CloseOutlined } from "@ant-design/icons";
import { Button, Card, Drawer, Form, Input, Modal, Select, Spin } from "antd";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

import { getNameInitials } from "@/utilities";
import { isManagerRole, roleOptions } from "@/utilities/role-options";
import { UPDATE_USER_MUTATION } from "@/graphql/mutations";
import { USER_QUERY } from "@/graphql/queries";
import { Role } from "@/graphql/schema.types";

import { Text } from "../text";
import CustomAvatar from "../custom-avatar";

import {
  UpdateUserMutation,
  UpdateUserMutationVariables,
} from "@/graphql/types";

type Props = {
  opened: boolean;
  setOpened: (opened: boolean) => void;
  userId: string;
};

type Identity = {
  id: string;
  role?: Role | null;
};

export const AccountSettings = ({ opened, setOpened, userId }: Props) => {
  const { data: identity } = useGetIdentity<Identity>();
  const canEditRole = isManagerRole(identity?.role);

  const { saveButtonProps, formProps, query } = useForm<
    GetFields<UpdateUserMutation>,
    HttpError,
    GetVariables<UpdateUserMutationVariables>
  >({
    mutationMode: "optimistic",
    resource: "users",
    action: "edit",
    id: userId,
    queryOptions: {
      enabled: opened,
    },
    meta: {
      gqlQuery: USER_QUERY,
      gqlMutation: UPDATE_USER_MUTATION,
    },
  });
  const { avatarUrl, name } = query?.data?.data || {};

  const discardAndClose = () => {
    formProps.form?.resetFields();
    setOpened(false);
  };

  const handleClose = () => {
    if (formProps.form?.isFieldsTouched()) {
      Modal.confirm({
        title: "Discard unsaved changes?",
        content: "You have unsaved changes that will be lost.",
        okText: "Discard",
        okButtonProps: { danger: true },
        cancelText: "Keep editing",
        onOk: discardAndClose,
      });
      return;
    }
    setOpened(false);
  };

  return (
    <Drawer
      onClose={handleClose}
      open={opened}
      width={756}
      maskClosable={false}
      styles={{
        body: { background: "#14120F", padding: 0 },
        header: { display: "none" },
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px",
          backgroundColor: "#1C1915",
          borderBottom: "1px solid rgba(176, 141, 87, 0.16)",
        }}
      >
        <Text strong style={{ color: "#F0E9DC" }}>
          Account Settings
        </Text>
        <Button type="text" icon={<CloseOutlined />} onClick={handleClose} />
      </div>
      <div
        style={{
          padding: "16px",
        }}
      >
        <Card>
          <Spin spinning={query?.isLoading}>
            <Form {...formProps} layout="vertical">
              <CustomAvatar
                shape="square"
                src={avatarUrl}
                name={getNameInitials(name || "")}
                style={{
                  width: 96,
                  height: 96,
                  marginBottom: "24px",
                }}
              />
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Name is required" }]}
              >
                <Input placeholder="Name" />
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
              <Form.Item label="Job title" name="jobTitle">
                <Input placeholder="Job title" />
              </Form.Item>
              <Form.Item
                label="Phone"
                name="phone"
                className="hb-phone-input"
                getValueProps={(value) => ({ value: value ?? "" })}
              >
                <PhoneInput defaultCountry="in" style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item label="Timezone" name="timezone">
                <Input placeholder="Timezone" />
              </Form.Item>
              {}
              {canEditRole && (
                <Form.Item
                  label="Role"
                  name="role"
                  extra="Changing your own role away from Admin or Sales Manager will remove your access to role and member management."
                >
                  <Select options={roleOptions} placeholder="Select role" />
                </Form.Item>
              )}
            </Form>
          </Spin>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "8px",
            }}
          >
            <Button onClick={handleClose}>Cancel</Button>
            <SaveButton {...saveButtonProps} />
          </div>
        </Card>
      </div>
    </Drawer>
  );
};
