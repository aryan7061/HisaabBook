import { Layout, Space, Typography } from "antd";
import { useGetIdentity } from "@refinedev/core";
import CurrentUser from "./current-user";
import SupportButton from "./support-button";

type Identity = {
  name?: string;
};

const Header = () => {
  const { data: identity } = useGetIdentity<Identity>();

  const headerStyles: React.CSSProperties = {
    background: "#1C1915",
    borderBottom: "1px solid rgba(176, 141, 87, 0.16)",
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
      <Typography.Text
        strong
        className="hb-display"
        style={{ fontSize: "16px", color: "#F0E9DC" }}
      >
        {identity?.name ? `Welcome back, ${identity.name}` : ""}
      </Typography.Text>
      <Space align="center" size="middle">
        <SupportButton />
        <CurrentUser />
      </Space>
    </Layout.Header>
  );
};

export default Header;
