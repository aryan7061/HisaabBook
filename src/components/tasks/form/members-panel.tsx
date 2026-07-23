import { useState } from "react";
import { Button, Divider, Select, Space, Typography } from "antd";
import {
  PlusOutlined,
  TeamOutlined,
  DownOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { useInvalidate, useList, useUpdate } from "@refinedev/core";
import { GetFieldsFromList } from "@refinedev/nestjs-query";

import { TEAM_MEMBERS_QUERY } from "@/graphql/queries";
import { TeamMembersQuery } from "@/graphql/types";
import { UPDATE_TASK_MUTATION } from "@/graphql/mutations";
import { AddMemberModal } from "@/components/add-member-modal";
import CustomAvatar from "@/components/custom-avatar";
import { MemberRow } from "@/components/member-row";

type TaskMember = {
  id: string;
  name: string;
  email?: string;
  phone?: string | null;
  avatarUrl?: string | null;
};

type Props = {
  taskId: string;
  members: TaskMember[];
};

type TeamUser = GetFieldsFromList<TeamMembersQuery>;

export const MembersPanel = ({ taskId, members }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [localMembers, setLocalMembers] = useState<TaskMember[]>(members);

  const invalidate = useInvalidate();
  const { mutate: updateTask } = useUpdate();

  // Scoped to source = TASK_MEMBER only — no Sales Owners or
  // Contact-linked users ever appear in the Task Members picker.
  const { result: usersResult } = useList<TeamUser>({
    resource: "users",
    pagination: { mode: "off" },
    sorters: [{ field: "name", order: "asc" }],
    filters: [{ field: "source", operator: "eq", value: "TASK_MEMBER" }],
    meta: { gqlQuery: TEAM_MEMBERS_QUERY },
  });

  const allUsers = usersResult.data ?? [];
  const memberIds = localMembers.map((m) => m.id);

  const saveMemberIds = (nextIds: string[], next: TaskMember[]) => {
    setLocalMembers(next);
    updateTask(
      {
        resource: "tasks",
        id: taskId,
        values: { userIds: nextIds },
        successNotification: false,
        meta: { gqlMutation: UPDATE_TASK_MUTATION },
      },
      {
        onSuccess: () =>
          invalidate({ resource: "tasks", invalidates: ["list", "detail"] }),
      },
    );
  };

  const handleUnassign = (userId: string) => {
    const next = localMembers.filter((m) => m.id !== userId);
    saveMemberIds(
      next.map((m) => m.id),
      next,
    );
  };

  const handleMemberUpdated = (updated: TaskMember) => {
    setLocalMembers((prev) =>
      prev.map((m) => (m.id === updated.id ? { ...m, ...updated } : m)),
    );
  };

  const handlePickExisting = (userId: string) => {
    if (memberIds.includes(userId)) return;
    const fullUser = allUsers.find((u) => u.id === userId);
    if (!fullUser) return;
    const next = [...localMembers, fullUser as TaskMember];
    saveMemberIds(
      next.map((m) => m.id),
      next,
    );
    setPickerOpen(false);
  };

  const handleCreatedNew = (user: {
    id: string;
    name: string;
    avatarUrl?: string | null;
  }) => {
    const next = [
      ...localMembers,
      { ...user, email: undefined, phone: undefined },
    ];
    saveMemberIds(
      next.map((m) => m.id),
      next,
    );
    setAddOpen(false);
  };

  return (
    <div
      style={{
        padding: "12px 24px",
        borderBottom: "1px solid rgba(176, 141, 87, 0.16)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          cursor: "pointer",
        }}
        onClick={() => setExpanded((v) => !v)}
      >
        <TeamOutlined style={{ color: "#8c8c8c" }} />
        <Space size={-8}>
          {localMembers.slice(0, 4).map((m) => (
            <CustomAvatar
              key={m.id}
              name={m.name}
              src={m.avatarUrl ?? undefined}
              style={{ border: "2px solid #14120F" }}
            />
          ))}
        </Space>
        <Typography.Text strong>
          Members ({localMembers.length})
        </Typography.Text>
        <div style={{ marginLeft: "auto" }}>
          {expanded ? <UpOutlined /> : <DownOutlined />}
        </div>
      </div>

      {expanded && (
        <div
          style={{
            marginTop: 12,
            background: "#221E18",
            border: "1px solid rgba(176, 141, 87, 0.16)",
            borderRadius: 8,
            padding: 8,
          }}
        >
          {localMembers.map((m) => (
            <MemberRow
              key={m.id}
              user={m}
              deleteConfirmTitle="Remove this member from the task?"
              onDelete={() => handleUnassign(m.id)}
              onUpdated={handleMemberUpdated}
            />
          ))}

          <Divider style={{ margin: "8px 0" }} />

          {pickerOpen ? (
            <Select
              autoFocus
              open
              showSearch
              placeholder="Search existing members..."
              style={{ width: "100%" }}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toString()
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={allUsers
                .filter((u) => !memberIds.includes(u.id))
                .map((u) => ({ value: u.id, label: u.name }))}
              onSelect={(value) => handlePickExisting(value as string)}
              onBlur={() => setPickerOpen(false)}
            />
          ) : (
            <Space>
              <Button
                size="small"
                type="dashed"
                icon={<PlusOutlined />}
                onClick={() => setPickerOpen(true)}
              >
                Add existing
              </Button>
              <Button
                size="small"
                type="dashed"
                icon={<PlusOutlined />}
                onClick={() => setAddOpen(true)}
              >
                Create new
              </Button>
            </Space>
          )}
        </div>
      )}

      <AddMemberModal
        title="Add New Member"
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreated={handleCreatedNew}
      />
    </div>
  );
};
