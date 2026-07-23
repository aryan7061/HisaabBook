import { useForm, useSelect } from "@refinedev/antd";
import { HttpError } from "@refinedev/core";
import {
  GetFields,
  GetFieldsFromList,
  GetVariables,
} from "@refinedev/nestjs-query";

import { FlagOutlined } from "@ant-design/icons";
import { Checkbox, Form, Select, Space } from "antd";

import { AccordionHeaderSkeleton } from "@/components";
import {
  TaskStagesSelectQuery,
  UpdateTaskMutation,
  UpdateTaskMutationVariables,
} from "@/graphql/types";

import { UPDATE_TASK_MUTATION } from "@/graphql/mutations";
import { TASK_STAGES_SELECT_QUERY } from "@/graphql/queries";
import { getStageColor } from "@/utilities/task-stage-colors";

type Props = {
  isLoading?: boolean;
};

const UNASSIGNED_VALUE = "";

export const StageForm = ({ isLoading }: Props) => {
  const { formProps } = useForm<
    GetFields<UpdateTaskMutation>,
    HttpError,
    Pick<GetVariables<UpdateTaskMutationVariables>, "stageId" | "completed">
  >({
    queryOptions: {
      enabled: false,
    },
    autoSave: {
      enabled: true,
      debounce: 0,
    },
    meta: {
      gqlMutation: UPDATE_TASK_MUTATION,
    },
  });

  const { selectProps } = useSelect<GetFieldsFromList<TaskStagesSelectQuery>>({
    resource: "taskStages",
    filters: [
      {
        field: "title",
        operator: "in",
        value: ["TODO", "IN PROGRESS", "IN REVIEW", "DONE"],
      },
    ],
    sorters: [
      {
        field: "createdAt",
        order: "asc",
      },
    ],
    meta: {
      gqlQuery: TASK_STAGES_SELECT_QUERY,
    },
  });

  const currentTitle =
    (selectProps.options ?? []).find(
      (o: any) => o.value === formProps?.initialValues?.stage?.id,
    )?.label ?? "TODO";

  if (isLoading) return <AccordionHeaderSkeleton />;

  return (
    <div
      style={{
        padding: "12px 24px",
        borderBottom: "1px solid rgba(176, 141, 87, 0.16)",
      }}
    >
      <Form
        layout="inline"
        style={{
          justifyContent: "space-between",
          alignItems: "center",
        }}
        {...formProps}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            border: "1px solid rgba(176, 141, 87, 0.32)",
            borderRadius: 999,
            padding: "2px 4px 2px 10px",
            background: "#221E18",
          }}
        >
          <FlagOutlined
            style={{ color: getStageColor(currentTitle as string) }}
          />
          <Form.Item
            noStyle
            name={["stageId"]}
            initialValue={formProps?.initialValues?.stage?.id}
            getValueProps={(value) => ({
              value: value === null ? UNASSIGNED_VALUE : value,
            })}
            normalize={(value) => (value === UNASSIGNED_VALUE ? null : value)}
          >
            <Select
              {...selectProps}
              popupMatchSelectWidth={false}
              options={selectProps.options?.concat([
                {
                  label: "Unassigned",
                  value: UNASSIGNED_VALUE,
                },
              ])}
              variant="borderless"
              showSearch={false}
              placeholder="Select a stage"
              onSearch={undefined}
              size="small"
            />
          </Form.Item>
        </div>
        <Form.Item noStyle name="completed" valuePropName="checked">
          <Checkbox>Mark as complete</Checkbox>
        </Form.Item>
      </Form>
    </div>
  );
};
