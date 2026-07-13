import { Button, Form, Input, Modal, Select } from "antd";
import { useCreate, useInvalidate } from "@refinedev/core";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { CREATE_USER_MUTATION } from "@/graphql/mutations";
import { Role } from "@/graphql/schema.types";

const roleOptions: { label: string; value: Role }[] = [
  { label: "Sales Person", value: "SALES_PERSON" },
  { label: "Sales Manager", value: "SALES_MANAGER" },
  { label: "Sales Intern", value: "SALES_INTERN" },
  { label: "Admin", value: "ADMIN" },
];

type CreatedUser = {
  id: string;
  name: string;
  avatarUrl?: string | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: (user: CreatedUser) => void;
  title?: string;
};

export const AddSalesOwnerModal = ({
  open,
  onClose,
  onCreated,
  title = "Add New Sales Owner",
}: Props) => {
  const [form] = Form.useForm();
  const invalidate = useInvalidate();
  const { mutate, mutation } = useCreate();

  const handleFinish = (values: {
    name: string;
    email: string;
    jobTitle: string;
    phone: string;
    timezone: string;
    role: Role;
  }) => {
    mutate(
      {
        resource: "users",
        values,
        meta: {
          gqlMutation: CREATE_USER_MUTATION,
        },
        successNotification: false,
      },
      {
        onSuccess: (data) => {
          const createdUser = (data as { data: CreatedUser }).data;
          invalidate({ resource: "users", invalidates: ["list"] });
          form.resetFields();
          onCreated(createdUser);
        },
      },
    );
  };

  return (
    <Modal
      title={title}
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
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
          label="Job Title"
          name="jobTitle"
          rules={[{ required: true, message: "Job title is required" }]}
        >
          <Input placeholder="Job title" />
        </Form.Item>
        <Form.Item
          label="Phone"
          name="phone"
          rules={[{ required: true, message: "Phone is required" }]}
        >
          <PhoneInput defaultCountry="in" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="Timezone"
          name="timezone"
          rules={[{ required: true, message: "Timezone is required" }]}
        >
          <Input placeholder="e.g. Asia/Kolkata" />
        </Form.Item>
        <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true, message: "Role is required" }]}
        >
          <Select options={roleOptions} placeholder="Select role" />
        </Form.Item>
        <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={mutation.isPending}>
            Create
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
