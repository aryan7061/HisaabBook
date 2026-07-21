import { useLogout, useMenu } from "@refinedev/core";
import { useThemedLayoutContext } from "@refinedev/antd";
import { Layout, Menu } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { Link } from "react-router";

type SiderProps = {
  Title?: React.FC<{ collapsed: boolean }>;
};

export const Sider = ({ Title }: SiderProps) => {
  const { menuItems, selectedKey } = useMenu();
  const { mutate: logout } = useLogout();
  const { siderCollapsed } = useThemedLayoutContext();

  const items = [
    ...menuItems.map((item) => ({
      key: item.key,
      icon: item.icon,
      label: <Link to={item.route ?? "/"}>{item.label}</Link>,
    })),
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
    },
  ];

  return (
    <Layout.Sider
      collapsed={siderCollapsed}
      width={240}
      style={{
        background: "#1C1915",
        borderRight: "1px solid rgba(176, 141, 87, 0.16)",
      }}
    >
      <div style={{ padding: "16px" }}>
        {Title && <Title collapsed={!!siderCollapsed} />}
      </div>
      <div
        className="hb-menu-glider-wrap"
        style={
          {
            position: "relative",
            "--hb-menu-total": items.length,
          } as React.CSSProperties
        }
      >
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          style={{ border: "none", padding: "0 12px" }}
          items={items}
          onClick={({ key }) => {
            if (key === "logout") logout();
          }}
        />
        {!siderCollapsed && (
          <div className="hb-glider-container">
            <div className="hb-glider" />
          </div>
        )}
      </div>
    </Layout.Sider>
  );
};
