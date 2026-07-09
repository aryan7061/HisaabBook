import { useGetIdentity, useGo, useUpdate } from "@refinedev/core";
import { Button, Card, Form, Input, Layout, Typography } from "antd";

import { UPDATE_USER_MUTATION } from "@/graphql/mutations";

const { Title, Paragraph } = Typography;

type Identity = {
  id: string;
  name?: string;
  email?: string;
};

export const CompleteProfile = () => {
  const go = useGo();
  const [form] = Form.useForm();

  const { data: identity, isLoading: identityLoading } =
    useGetIdentity<Identity>();

  const { mutate, mutation } = useUpdate();

  const onFinish = (values: { name: string }) => {
    if (!identity?.id) return;

    mutate(
      {
        resource: "users",
        id: identity.id,
        values: { name: values.name },
        meta: {
          gqlMutation: UPDATE_USER_MUTATION,
        },
        successNotification: false,
      },
      {
        onSuccess: () => {
          go({ to: "/", type: "replace" });
        },
      },
    );
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card style={{ width: 420 }} loading={identityLoading}>
        <Title level={3} style={{ marginBottom: 0 }}>
          Complete your profile
        </Title>
        <Paragraph type="secondary">
          Welcome{identity?.email ? `, ${identity.email}` : ""}! Let us know
          what to call you.
        </Paragraph>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Your name"
            name="name"
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input placeholder="e.g. Jane Doe" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={mutation.isPending}
              block
            >
              Save and continue
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Layout>
  );
};

export default CompleteProfile;
