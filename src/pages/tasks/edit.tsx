import React, { useState } from "react";

import { DeleteButton, useModalForm } from "@refinedev/antd";
import { useGetIdentity, useNavigation } from "@refinedev/core";
import { message } from "antd";

import { AlignLeftOutlined, FieldTimeOutlined } from "@ant-design/icons";
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
} from "@/components";
import { MembersPanel } from "@/components/tasks/form/members-panel";
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

  const { description, dueDate, users, title, createdBy, id } =
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

      {isLoading || !id ? (
        <AccordionHeaderSkeleton />
      ) : (
        <MembersPanel taskId={id} members={users ?? []} />
      )}
    </Modal>
  );
};

export default TasksEditPage;
