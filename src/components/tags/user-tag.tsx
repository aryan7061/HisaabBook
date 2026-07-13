import { Space, Tag } from "antd";

import { User } from "@/graphql/schema.types";
import CustomAvatar from "../custom-avatar";
import { Text } from "../text";

type Props = {
  user: User;
};

// display a user's avatar, name, and phone (if available) in a tag
export const UserTag = ({ user }: Props) => {
  return (
    <Tag
      key={user.id}
      style={{
        padding: 2,
        paddingRight: 8,
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
            <Text size="xs" style={{ color: "#8c8c8c", marginLeft: "4px" }}>
              ({user.phone})
            </Text>
          )}
        </span>
      </Space>
    </Tag>
  );
};
