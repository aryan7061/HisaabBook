import { Text } from "@/components/text";
import { PlusOutlined } from "@ant-design/icons";
import { useDroppable, UseDroppableArguments } from "@dnd-kit/core";
import { Button, Space } from "antd";

type Props = {
  id: string;
  title: string;
  description?: React.ReactNode;
  count: number;
  color?: string;
  data?: UseDroppableArguments["data"];
  onAddClick?: (args: { id: string }) => void;
};

export const KanbanColumn = ({
  children,
  id,
  title,
  description,
  count,
  color = "var(--hb-text-secondary)",
  data,
  onAddClick,
}: React.PropsWithChildren<Props>) => {
  const { isOver, setNodeRef, active } = useDroppable({
    id,
    data,
  });

  const onAddClickHandler = () => {
    onAddClick?.({ id });
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "0 var(--hb-space-4)",
        minWidth: 280,
      }}
    >
      <div style={{ padding: "var(--hb-space-3)" }}>
        <Space style={{ width: "100%", justifyContent: "space-between" }}>
          <Space size={8}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: color,
                display: "inline-block",
              }}
            />
            <Text
              ellipsis={{ tooltip: title }}
              size="xs"
              strong
              style={{
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              {title}
            </Text>
            {!!count && (
              <span
                style={{
                  background: `color-mix(in srgb, ${color} 14%, transparent)`,
                  color,
                  fontSize: 12,
                  fontWeight: 600,
                  borderRadius: 10,
                  padding: "1px var(--hb-space-2)",
                }}
              >
                {count}
              </span>
            )}
          </Space>
          <Button
            shape="circle"
            icon={<PlusOutlined />}
            onClick={onAddClickHandler}
          />
        </Space>
        {description}
      </div>
      <div
        style={{
          flex: 1,
          overflowY: active ? "unset" : "auto",
          border: "2px dashed transparent",
          borderColor: isOver ? "var(--hb-gold)" : "transparent",
          borderRadius: "var(--hb-space-2)",
          transition: "border-color 0.15s ease",
        }}
      >
        <div
          style={{
            marginTop: "var(--hb-space-3)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--hb-space-2)",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
