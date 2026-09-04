import { useEffect, useState } from "react";

import { DeleteButton, useModalForm } from "@refinedev/antd";
import { useNavigation } from "@refinedev/core";
import { message, Modal } from "antd";

import { AlignLeftOutlined, FieldTimeOutlined } from "@ant-design/icons";

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
import { resolveRecordAccess, useAccessScope } from "@/utilities/access-scope";

import { TASK_QUERY } from "@/graphql/queries";
import { UPDATE_TASK_MUTATION } from "@/graphql/mutations";

const TasksEditPage = () => {
  const [activeKey, setActiveKey] = useState<string | undefined>();
  const [redirected, setRedirected] = useState(false);

  const { list } = useNavigation();
  const {
    identityId,
    isLoading: identityLoading,
    seesAllRecords,
  } = useAccessScope();

  const { modalProps, close, query } = useModalForm<Task>({
    action: "edit",
    defaultVisible: true,
    meta: {
      gqlQuery: TASK_QUERY,
      gqlMutation: UPDATE_TASK_MUTATION,
    },
  });

  const task = query?.data?.data;

  const {
    description,
    dueDate,
    users,
    title,
    createdBy,
    id,
    stage,
    completed,
  } = task ?? {};

  const access = resolveRecordAccess({
    identityLoading,
    recordLoading: query?.isLoading ?? true,
    recordError: query?.isError ?? false,
    hasRecord: !!task,
    isOwner: !!createdBy?.id && createdBy.id === identityId,
    seesAllRecords,
  });

  useEffect(() => {
    if (access !== "denied" || redirected) return;

    setRedirected(true);
    message.warning("You don't have permission to view this task.");
    close();
    list("tasks", "replace");
  }, [access, redirected]);

  const isLoading = access !== "granted";

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
      <StageForm
        isLoading={isLoading}
        taskId={id}
        initialValues={{ stageId: stage?.id ?? null, completed }}
      />

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
          taskId={id}
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
          taskId={id}
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
