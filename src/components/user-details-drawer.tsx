import { SaveButton, useForm } from "@refinedev/antd";
import { HttpError } from "@refinedev/core";
import { GetFields, GetVariables } from "@refinedev/nestjs-query";

import { CloseOutlined } from "@ant-design/icons";
import { Button, Card, Drawer, Form, Input, Modal, Spin } from "antd";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

import { getNameInitials } from "@/utilities";
import { UPDATE_USER_MUTATION } from "@/graphql/mutations";

import { Text } from "./text";
import CustomAvatar from "./custom-avatar";

import {
  UpdateUserMutation,
  UpdateUserMutationVariables,
} from "@/graphql/types";

type Props = {
  opened: boolean;
  setOpened: (opened: boolean) => void;
  userId?: string;
};

// Same structure as AccountSettings, but parameterized by an arbitrary
// userId — used when clicking any assigned user's name in Task edit to
// view/edit their details, not just the current logged-in user's own.
export const UserDetailsDrawer = ({ opened, setOpened, userId }: Props) => {
  const { saveButtonProps, formProps, query } = useForm<
    GetFields<UpdateUserMutation>,
    HttpError,
    GetVariables<UpdateUserMutationVariables>
  >({
    resource: "users",
    action: "edit",
    id: userId,
    queryOptions: {
      enabled: opened && !!userId,
    },
    meta: {
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
        body: { background: "#f5f5f5", padding: 0 },
        header: { display: "none" },
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px",
          backgroundColor: "#fff",
        }}
      >
        <Text strong>User Details</Text>
        <Button type="text" icon={<CloseOutlined />} onClick={handleClose} />
      </div>
      <div style={{ padding: "16px" }}>
        <Card>
          <Spin spinning={query?.isLoading}>
            <Form {...formProps} layout="vertical">
              <CustomAvatar
                shape="square"
                src={avatarUrl}
                name={getNameInitials(name || "")}
                style={{ width: 96, height: 96, marginBottom: "24px" }}
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
              <Form.Item label="Phone" name="phone">
                <PhoneInput defaultCountry="in" style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item label="Timezone" name="timezone">
                <Input placeholder="Timezone" />
              </Form.Item>
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
