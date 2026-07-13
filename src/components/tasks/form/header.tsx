import { MarkdownField } from "@refinedev/antd";

import { Typography, Space, Tag, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import dayjs from "dayjs";

import { Text, UserTag } from "@/components";
import { getDateColor } from "@/utilities";

import { Task } from "@/graphql/schema.types";

type DescriptionProps = {
  description?: Task["description"];
};

type DueDateProps = {
  dueData?: Task["dueDate"];
};

type UserProps = {
  users?: Task["users"];
  onUserClick?: (user: NonNullable<Task["users"]>[number]) => void;
  onAddClick?: () => void;
};

// display a task's descriptio if it exists, otherwise display a link to add one
export const DescriptionHeader = ({ description }: DescriptionProps) => {
  if (description) {
    return (
      <Typography.Paragraph ellipsis={{ rows: 8 }}>
        <MarkdownField value={description} />
      </Typography.Paragraph>
    );
  }

  // if the task doesn't have a description, display a link to add one
  return <Typography.Link>Add task description</Typography.Link>;
};

// display a task's due date if it exists, otherwise display a link to add one
export const DueDateHeader = ({ dueData }: DueDateProps) => {
  if (dueData) {
    // get the color of the due date
    const color = getDateColor({
      date: dueData,
      defaultColor: "processing",
    });

    // depending on the due date, display a different color and text
    const getTagText = () => {
      switch (color) {
        case "error":
          return "Overdue";

        case "warning":
          return "Due soon";

        default:
          return "Processing";
      }
    };

    return (
      <Space size={[0, 8]}>
        <Tag color={color}>{getTagText()}</Tag>
        <Text>{dayjs(dueData).format("MMMM D, YYYY - h:ma")}</Text>
      </Space>
    );
  }

  // if the task doesn't have a due date, display a link to add one
  return <Typography.Link>Add due date</Typography.Link>;
};

// display a task's assigned users as clickable tags (opens that user's
// details), plus a dedicated button to open the assign-users editor —
// clicking a user's tag and adding more users are now separate actions.
export const UsersHeader = ({
  users = [],
  onUserClick,
  onAddClick,
}: UserProps) => {
  return (
    <Space size={[8, 8]} wrap style={{ width: "100%" }}>
      {users.map((user) => (
        <span
          key={user.id}
          onClick={(e) => {
            e.stopPropagation();
            onUserClick?.(user);
          }}
          style={{ cursor: "pointer" }}
        >
          <UserTag user={user} />
        </span>
      ))}
      <Button
        size="small"
        type="dashed"
        icon={<PlusOutlined />}
        onClick={(e) => {
          e.stopPropagation();
          onAddClick?.();
        }}
      >
        Add
      </Button>
    </Space>
  );
};
