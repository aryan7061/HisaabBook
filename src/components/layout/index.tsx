import { ThemedLayout, ThemedTitle } from "@refinedev/antd";
import Header from "./header";
import { Sider } from "./sider";
import logo from "@/assets/logo.png";

const Layout = ({ children }: React.PropsWithChildren) => {
  return (
    <ThemedLayout
      Header={Header}
      Sider={Sider}
      Title={(titleProps) => (
        <ThemedTitle
          {...titleProps}
          text="HisaabBook"
          icon={
            <img
              src={logo}
              alt="HisaabBook"
              style={{
                width: 28,
                height: 28,
                objectFit: "cover",
                borderRadius: 6,
              }}
            />
          }
        />
      )}
    >
      {children}
    </ThemedLayout>
  );
};

export default Layout;
