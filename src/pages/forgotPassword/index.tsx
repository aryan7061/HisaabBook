import { AuthPage } from "@refinedev/antd";
import { AuthLayout } from "@/components/auth-layout";

export const ForgotPassword = () => {
  return (
    <AuthLayout showLiveDemo={false}>
      <AuthPage type="forgotPassword" title={false} />
    </AuthLayout>
  );
};
