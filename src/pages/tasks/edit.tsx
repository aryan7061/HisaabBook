import React, { useState } from "react";

import { DeleteButton, useModalForm } from "@refinedev/antd";
import { useGetIdentity, useNavigation } from "@refinedev/core";
import { message } from "antd";

import {
  AlignLeftOutlined,
  FieldTimeOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Modal } from "antd";

import {
  Accordion,
  AccordionHeaderSkeleton,
  DescriptionForm,
  DescriptionHeader,
  DueDateForm,
  DueDateHeader,
  StageForm,
  TitleForm,
  UsersForm,
  UsersHeader,
} from "@/components";
import { UserDetailsDrawer } from "@/components/user-details-drawer";
import { Task } from "@/graphql/schema.types";
import { isDemoAccount } from "@/utilities/helpers";

import { TASK_QUERY } from "@/graphql/queries";
import { UPDATE_TASK_MUTATION } from "@/graphql/mutations";

type Identity = {
  id: string;
  email: string;
};

const TasksEditPage = () => {
  const [activeKey, setActiveKey] = useState<string | undefined>();
  const [checkedOwnership, setCheckedOwnership] = useState(false);
  const [viewingUserId, setViewingUserId] = useState<string | undefined>();

  const { list } = useNavigation();
  const { data: identity, isLoading: identityLoading } =
    useGetIdentity<Identity>();
  const isDemo = isDemoAccount(identity?.email);

  const { modalProps, close, query } = useModalForm<Task>({
    action: "edit",
    defaultVisible: true,
    meta: {
      gqlQuery: TASK_QUERY,
      gqlMutation: UPDATE_TASK_MUTATION,
    },
  });

  const { description, dueDate, users, title, createdBy } =
    query?.data?.data ?? {};

  const queryLoading = query?.isLoading ?? true;

  React.useEffect(() => {
    if (queryLoading || identityLoading || !query?.data?.data) return;

    const isOwner = createdBy?.id === identity?.id;

    if (!isDemo && !isOwner) {
      message.warning("You don't have permission to view this task.");
      close();
      list("tasks", "replace");
      return;
    }

    setCheckedOwnership(true);
  }, [queryLoading, identityLoading, query?.data?.data, isDemo, identity?.id]);

  const isLoading = queryLoading || identityLoading || !checkedOwnership;

  return (
    <Modal
      {...modalProps}
      className="kanban-update-modal"
      onCancel={() => {
        close();
        list("tasks", "replace");
      }}
      title={<TitleForm initialValues={{ title }} isLoading={isLoading} />}
      width={586}
      footer={
        <DeleteButton
          type="link"
          onSuccess={() => {
            list("tasks", "replace");
          }}
        >
          Delete card
        </DeleteButton>
      }
    >
      <StageForm isLoading={isLoading} />

      <Accordion
        accordionKey="description"
        activeKey={activeKey}
        setActive={setActiveKey}
        fallback={<DescriptionHeader description={description} />}
        isLoading={isLoading}
        icon={<AlignLeftOutlined />}
        label="Description"
      >
        <DescriptionForm
          initialValues={{ description }}
          cancelForm={() => setActiveKey(undefined)}
        />
      </Accordion>

      <Accordion
        accordionKey="due-date"
        activeKey={activeKey}
        setActive={setActiveKey}
        fallback={<DueDateHeader dueData={dueDate} />}
        isLoading={isLoading}
        icon={<FieldTimeOutlined />}
        label="Due date"
      >
        <DueDateForm
          initialValues={{ dueDate: dueDate ?? undefined }}
          cancelForm={() => setActiveKey(undefined)}
        />
      </Accordion>

      {isLoading ? (
        <AccordionHeaderSkeleton />
      ) : (
        <div
          style={{
            display: "flex",
            padding: "12px 24px",
            gap: "12px",
            alignItems: "start",
            borderBottom: "1px solid #d9d9d9",
          }}
        >
          <div style={{ marginTop: "1px", flexShrink: 0 }}>
            <UsergroupAddOutlined />
          </div>
          {activeKey === "users" ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                flex: 1,
              }}
            >
              <span style={{ fontWeight: 600 }}>Users</span>
              <UsersForm
                initialValues={{
                  userIds: users?.map((user) => ({
                    label: user.name,
                    value: user.id,
                  })),
                }}
                cancelForm={() => setActiveKey(undefined)}
              />
            </div>
          ) : (
            <div style={{ flex: 1 }}>
              <UsersHeader
                users={users}
                onUserClick={(user) => setViewingUserId(user.id)}
                onAddClick={() => setActiveKey("users")}
              />
            </div>
          )}
        </div>
      )}

      <UserDetailsDrawer
        opened={!!viewingUserId}
        setOpened={(opened) => !opened && setViewingUserId(undefined)}
        userId={viewingUserId}
      />
    </Modal>
  );
};

export default TasksEditPage;
