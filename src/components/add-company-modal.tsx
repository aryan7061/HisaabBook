import { Button, Form, Input, Modal } from "antd";
import { useCreate, useGetIdentity, useInvalidate } from "@refinedev/core";
import { CREATE_COMPANY_MUTATION } from "@/graphql/mutations";

type CreatedCompany = {
  id: string;
  name: string;
};

type Identity = {
  id: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: (company: CreatedCompany) => void;
};

export const AddCompanyModal = ({ open, onClose, onCreated }: Props) => {
  const [form] = Form.useForm();
  const invalidate = useInvalidate();
  const { mutate, mutation } = useCreate();
  const { data: identity } = useGetIdentity<Identity>();

  const handleFinish = (values: { name: string }) => {
    if (!identity?.id) return;

    mutate(
      {
        resource: "companies",
        values: { name: values.name.trim(), salesOwnerId: identity.id },
        meta: { gqlMutation: CREATE_COMPANY_MUTATION },
        successNotification: false,
      },
      {
        onSuccess: (data) => {
          const created = (data as { data: { id: string } }).data;
          invalidate({ resource: "companies", invalidates: ["list"] });
          form.resetFields();
          onCreated({ id: created.id, name: values.name.trim() });
        },
      },
    );
  };

  return (
    <Modal
      title="Add New Company"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label="Company Name"
          name="name"
          rules={[{ required: true, message: "Company name is required" }]}
        >
          <Input autoComplete="off" placeholder="Company name" />
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
