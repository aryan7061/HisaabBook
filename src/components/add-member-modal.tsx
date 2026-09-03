import { Button, Form, Input, Modal, Select } from "antd";
import { useCreate, useGetIdentity, useInvalidate } from "@refinedev/core";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { CREATE_USER_MUTATION } from "@/graphql/mutations";
import { isManagerRole, roleOptions } from "@/utilities/role-options";
import { Role } from "@/graphql/schema.types";

type CreatedUser = {
  id: string;
  name: string;
  avatarUrl?: string | null;
};

type Identity = {
  id: string;
  role?: Role | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: (user: CreatedUser) => void;
  title?: string;
};

export const AddMemberModal = ({
  open,
  onClose,
  onCreated,
  title = "Add New Member",
}: Props) => {
  const [form] = Form.useForm();
  const invalidate = useInvalidate();
  const { mutate, mutation } = useCreate();
  const { data: identity } = useGetIdentity<Identity>();

  const isManager = isManagerRole(identity?.role);

  const handleFinish = (values: {
    name: string;
    email: string;
    phone: string;
    role?: Role;
  }) => {
    const { role, ...rest } = values;

    mutate(
      {
        resource: "users",
        values:
          isManager && role
            ? { ...rest, role, source: "TASK_MEMBER" }
            : { ...rest, source: "TASK_MEMBER" },
        meta: { gqlMutation: CREATE_USER_MUTATION },
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
          <Input autoComplete="off" placeholder="Full name" />
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
          className="hb-phone-input"
          rules={[{ required: true, message: "Phone is required" }]}
        >
          <PhoneInput defaultCountry="in" style={{ width: "100%" }} />
        </Form.Item>
        {isManager && (
          <Form.Item
            label="Role"
            name="role"
            extra="Leave blank to create the member as a Sales Person."
          >
            <Select
              options={roleOptions}
              placeholder="Select role"
              allowClear
            />
          </Form.Item>
        )}
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
