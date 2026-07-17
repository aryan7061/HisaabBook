import { Button, Form, Input, Modal } from "antd";
import { useCreate, useInvalidate } from "@refinedev/core";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { CREATE_USER_MUTATION } from "@/graphql/mutations";

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

// Always creates users tagged source: TASK_MEMBER — this modal is only
// ever used from the Task Members panels (per-task and the global Team
// Members panel), never from Companies/Contacts (that's
// AddSalesOwnerModal, a separate component left untouched).
export const AddMemberModal = ({
  open,
  onClose,
  onCreated,
  title = "Add New Member",
}: Props) => {
  const [form] = Form.useForm();
  const invalidate = useInvalidate();
  const { mutate, mutation } = useCreate();

  const handleFinish = (values: {
    name: string;
    email: string;
    phone: string;
  }) => {
    mutate(
      {
        resource: "users",
        values: { ...values, source: "TASK_MEMBER" },
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
          rules={[{ required: true, message: "Phone is required" }]}
        >
          <PhoneInput defaultCountry="in" style={{ width: "100%" }} />
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
