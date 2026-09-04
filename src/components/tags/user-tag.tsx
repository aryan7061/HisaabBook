import { Space, Tag } from "antd";

import { User } from "@/graphql/schema.types";
import CustomAvatar from "../custom-avatar";
import { Text } from "../text";

type Props = {
  user: User;
};

export const UserTag = ({ user }: Props) => {
  return (
    <Tag
      key={user.id}
      style={{
        padding: 2,
        paddingRight: "var(--hb-space-2)",
        borderRadius: 24,
        lineHeight: "unset",
        marginRight: "unset",
      }}
    >
      <Space size={4}>
        <CustomAvatar
          src={user.avatarUrl}
          name={user.name}
          style={{ display: "inline-flex" }}
        />
        <span>
          {user.name}
          {user.phone && (
            <Text
              size="xs"
              style={{
                color: "var(--hb-text-secondary)",
                marginLeft: "var(--hb-space-1)",
              }}
            >
              ({user.phone})
            </Text>
          )}
        </span>
      </Space>
    </Tag>
  );
};
