import { useState } from "react";
import { App, Button, Divider, Input, Modal, Typography } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useDelete, useList } from "@refinedev/core";
import { GetFieldsFromList } from "@refinedev/nestjs-query";

import { TEAM_MEMBERS_QUERY } from "@/graphql/queries";
import { TeamMembersQuery } from "@/graphql/types";
import { MemberRow } from "@/components/member-row";
import { AddMemberModal } from "@/components/add-member-modal";

type Props = {
  open: boolean;
  onClose: () => void;
};

type TeamUser = GetFieldsFromList<TeamMembersQuery>;

// Scoped to source = TASK_MEMBER only, same as the per-task picker — no
// Sales Owners or Contact-linked users appear here either.
export const TeamMembersModal = ({ open, onClose }: Props) => {
  const { message } = App.useApp();
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);

  const { result, query } = useList<TeamUser>({
    resource: "users",
    pagination: { mode: "off" },
    sorters: [{ field: "name", order: "asc" }],
    filters: [{ field: "source", operator: "eq", value: "TASK_MEMBER" }],
    queryOptions: { enabled: open },
    meta: { gqlQuery: TEAM_MEMBERS_QUERY },
  });

  const { mutate: deleteUser } = useDelete();

  const users = result.data ?? [];
  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      (u.email ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = (id: string) => {
    deleteUser(
      { resource: "users", id, successNotification: false },
      {
        onError: (error: any) => {
          message.error(error?.message ?? "Couldn't delete this member.");
        },
        onSuccess: () => {
          message.success("Member removed.");
          query.refetch();
        },
      },
    );
  };

  return (
    <>
      <Modal open={open} onCancel={onClose} footer={null} width={480}>
        <div style={{ marginBottom: 4 }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            Team Members
          </Typography.Title>
          <Typography.Text type="secondary">
            {users.length} member{users.length === 1 ? "" : "s"} in workspace
          </Typography.Text>
        </div>

        <Divider style={{ margin: "12px 0" }} />

        <Input
          prefix={<SearchOutlined style={{ color: "#B08D57" }} />}
          placeholder="Search members"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginBottom: 12 }}
          allowClear
        />

        <div style={{ maxHeight: 360, overflowY: "auto" }}>
          {filtered.map((u) => (
            <MemberRow
              key={u.id}
              user={u}
              showRoleBadge
              deleteConfirmTitle="Delete this team member? This can't be undone."
              onDelete={() => handleDelete(u.id)}
              onUpdated={() => query.refetch()}
            />
          ))}
        </div>

        <Divider style={{ margin: "12px 0" }} />

        <Button
          block
          type="dashed"
          icon={<PlusOutlined />}
          style={{ borderColor: "#B08D57", color: "#B08D57" }}
          onClick={() => setAddOpen(true)}
        >
          Add new member
        </Button>
      </Modal>

      <AddMemberModal
        title="Add New Member"
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreated={() => {
          setAddOpen(false);
          query.refetch();
        }}
      />
    </>
  );
};
