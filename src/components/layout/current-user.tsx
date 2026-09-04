import { Popover, Button, Typography } from "antd";
import CustomAvatar from "../custom-avatar";
import { useState } from "react";
import { useGetIdentity } from "@refinedev/core";
import { SettingOutlined } from "@ant-design/icons";

import type { User } from "@/graphql/schema.types";
import { AccountSettings } from "./account-settings";

const { Text } = Typography;

const CurrentUser = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: user } = useGetIdentity<User>();

  const content = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Text strong style={{ padding: "var(--hb-space-3) 20px" }}>
        {user?.name}
      </Text>
      <div
        style={{
          borderTop: "1px solid var(--hb-divider)",
          padding: "var(--hb-space-1)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--hb-space-1)",
        }}
      >
        <Button
          style={{ textAlign: "left" }}
          icon={<SettingOutlined />}
          type="text"
          block
          onClick={() => setIsOpen(true)}
        >
          Account Settings
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <Popover
        placement="bottomRight"
        trigger="click"
        styles={{
          body: {
            padding: 0,
          },
          root: {
            zIndex: 999,
          },
        }}
        content={content}
      >
        <CustomAvatar
          name={user?.name ?? ""}
          src={user?.avatarUrl}
          size="default"
          style={{ cursor: "pointer" }}
        />
      </Popover>
      {user && (
        <AccountSettings
          opened={isOpen}
          setOpened={setIsOpen}
          userId={user.id}
        />
      )}
    </>
  );
};

export default CurrentUser;
