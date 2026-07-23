import { useState } from "react";
import { Button, Form, Input, Popconfirm, Space, Tag, Typography } from "antd";
import { DeleteOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";
import { useUpdate } from "@refinedev/core";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

import CustomAvatar from "@/components/custom-avatar";
import { UPDATE_USER_MUTATION } from "@/graphql/mutations";

type MemberUser = {
  id: string;
  name: string;
  email?: string;
  phone?: string | null;
  avatarUrl?: string | null;
  role?: string;
};

type Props = {
  user: MemberUser;
  onDelete: () => void;
  onUpdated?: (user: MemberUser) => void;
  deleteConfirmTitle: string;
  showRoleBadge?: boolean;
};

export const MemberRow = ({
  user,
  onDelete,
  onUpdated,
  deleteConfirmTitle,
  showRoleBadge,
}: Props) => {
  const [editing, setEditing] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [form] = Form.useForm();
  const { mutate, mutation } = useUpdate();

  const handleSave = (values: {
    name: string;
    email: string;
    phone: string;
  }) => {
    mutate(
      {
        resource: "users",
        id: user.id,
        values,
        meta: { gqlMutation: UPDATE_USER_MUTATION },
        successNotification: false,
      },
      {
        onSuccess: () => {
          onUpdated?.({ ...user, ...values });
          setEditing(false);
        },
      },
    );
  };

  if (editing) {
    return (
      <div
        style={{
          padding: "12px",
          background: "#221E18",
          borderRadius: 8,
          marginBottom: 4,
        }}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            name: user.name,
            email: user.email,
            phone: user.phone ?? "",
          }}
          onFinish={handleSave}
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Name is required" }]}
            style={{ marginBottom: 8 }}
          >
            <Input
              autoComplete="off"
              prefix={<UserOutlined style={{ color: "#B08D57" }} />}
              placeholder="Name"
            />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Valid email required" },
            ]}
            style={{ marginBottom: 8 }}
          >
            <Input
              autoComplete="off"
              prefix={<MailOutlined style={{ color: "#B08D57" }} />}
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item
            name="phone"
            rules={[{ required: true, message: "Phone is required" }]}
            style={{ marginBottom: 12 }}
          >
            <PhoneInput defaultCountry="in" style={{ width: "100%" }} />
          </Form.Item>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button size="small" onClick={() => setEditing(false)}>
              Cancel
            </Button>
            <Button
              size="small"
              type="primary"
              htmlType="submit"
              loading={mutation.isPending}
            >
              Save
            </Button>
          </div>
        </Form>
      </div>
    );
  }

  return (
    <div
      className="hb-member-row"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 12px",
      }}
    >
      <div
        onClick={() => setEditing(true)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          flex: 1,
          minWidth: 0,
          cursor: "pointer",
        }}
      >
        <CustomAvatar name={user.name} src={user.avatarUrl ?? undefined} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Typography.Text strong ellipsis>
              {user.name}
            </Typography.Text>
            {showRoleBadge && user.role === "ADMIN" && (
              <Tag color="#B08D57">Admin</Tag>
            )}
          </div>
          <Typography.Text
            type="secondary"
            ellipsis
            style={{ fontSize: 12, display: "block" }}
          >
            {user.email}
            {user.phone ? ` · ${user.phone}` : ""}
          </Typography.Text>
        </div>
      </div>
      <Space
        size={4}
        style={{ opacity: hovered ? 1 : 0, transition: "opacity 0.15s ease" }}
      >
        <Popconfirm
          title={deleteConfirmTitle}
          okText="Yes"
          cancelText="Cancel"
          onConfirm={onDelete}
        >
          <Button
            size="small"
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={(e) => e.stopPropagation()}
          />
        </Popconfirm>
      </Space>
    </div>
  );
};
