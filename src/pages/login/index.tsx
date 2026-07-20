import { useLogin } from "@refinedev/core";
import { Button, Card, Checkbox, Form, Input, Typography } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Link } from "react-router";

import { AuthLayout } from "@/components/auth-layout";
import { AuthTabs } from "@/components/auth-tabs";

type LoginVariables = {
  email: string;
  password: string;
};

export const Login = () => {
  const { mutate: login } = useLogin<LoginVariables>();
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
        <AuthTabs active="login" />

        <Typography.Title
          level={3}
          style={{ textAlign: "center", marginBottom: 32 }}
        >
          Sign in to your account
        </Typography.Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => login(values)}
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
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password
              prefix={
                <LockOutlined style={{ color: "#B08D57", marginRight: 8 }} />
              }
              placeholder="Password"
              style={{ borderRadius: 24, paddingLeft: 16 }}
            />
          </Form.Item>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <Link to="/forgot-password" style={{ color: "#B08D57" }}>
              Forgot password?
            </Link>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            block
            style={{ borderRadius: 24, height: 44 }}
          >
            Sign in
          </Button>
        </Form>

        <Typography.Paragraph
          style={{ textAlign: "center", marginTop: 16, marginBottom: 0 }}
        >
          Don&apos;t have an account?{" "}
          <Link to="/register" style={{ color: "#B08D57", fontWeight: 600 }}>
            Sign up
          </Link>
        </Typography.Paragraph>
      </Card>
    </AuthLayout>
  );
};
