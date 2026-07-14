import { useRegister } from "@refinedev/core";
import { Button, Card, Form, Input, Typography } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Link } from "react-router";

import { AuthLayout } from "@/components/auth-layout";
import { AuthTabs } from "@/components/auth-tabs";

type RegisterVariables = {
  email: string;
  password: string;
};

export const Register = () => {
  const { mutate: register } = useRegister<RegisterVariables>();
  const [form] = Form.useForm();

  return (
    <AuthLayout>
      <Card
        style={{
          width: 380,
          borderRadius: 16,
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        }}
        styles={{ body: { padding: "24px 32px 32px" } }}
      >
        <AuthTabs active="register" />

        <Typography.Title
          level={3}
          style={{ textAlign: "center", marginBottom: 32 }}
        >
          Create your account
        </Typography.Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => register(values)}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input
              prefix={
                <MailOutlined style={{ color: "#B08D57", marginRight: 8 }} />
              }
              placeholder="you@example.com"
              style={{ borderRadius: 24, paddingLeft: 16 }}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Password is required" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input.Password
              prefix={
                <LockOutlined style={{ color: "#B08D57", marginRight: 8 }} />
              }
              placeholder="Password"
              style={{ borderRadius: 24, paddingLeft: 16 }}
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            style={{ borderRadius: 24, height: 44, marginTop: 8 }}
          >
            Sign up
          </Button>
        </Form>

        <Typography.Paragraph
          style={{ textAlign: "center", marginTop: 16, marginBottom: 0 }}
        >
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#B08D57", fontWeight: 600 }}>
            Sign in
          </Link>
        </Typography.Paragraph>
      </Card>
    </AuthLayout>
  );
};
