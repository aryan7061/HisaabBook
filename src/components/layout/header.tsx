import { Layout, Space, Typography } from "antd";
import { useGetIdentity } from "@refinedev/core";
import CurrentUser from "./current-user";

type Identity = {
  name?: string;
};

const Header = () => {
  const { data: identity } = useGetIdentity<Identity>();

  const headerStyles: React.CSSProperties = {
    background: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 24px",
    position: "sticky",
    top: 0,
    zIndex: 999,
  };

  return (
    <Layout.Header style={headerStyles}>
      <Typography.Text strong style={{ fontSize: "16px" }}>
        {identity?.name ? `Welcome back, ${identity.name}` : ""}
      </Typography.Text>
      <Space align="center" size="middle">
        <CurrentUser />
      </Space>
    </Layout.Header>
  );
};

export default Header;
