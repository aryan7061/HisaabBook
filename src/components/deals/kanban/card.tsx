import CustomAvatar from "@/components/custom-avatar";
import { Text } from "@/components/text";
import { formatIndianCurrency } from "@/utilities/helpers";
import {
  DeleteOutlined,
  DollarOutlined,
  EyeOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { useDelete, useNavigation } from "@refinedev/core";
import {
  Button,
  Card,
  ConfigProvider,
  Dropdown,
  MenuProps,
  Modal,
  Space,
  Tooltip,
  theme,
} from "antd";
import React, { memo, useMemo } from "react";

type DealCardProps = {
  id: string;
  title: string;
  value?: number | null;
  company?: {
    id: string;
    name: string;
    avatarUrl?: string | null;
  } | null;
};

export const DealCard = ({ id, title, value, company }: DealCardProps) => {
  const { token } = theme.useToken();
  const { edit } = useNavigation();
  const { mutate } = useDelete();

  const handleDelete = () => {
    Modal.confirm({
      title: "Delete this deal?",
      content: "This action cannot be undone.",
      okText: "Delete",
      okButtonProps: { danger: true },
      cancelText: "Cancel",
      onOk: () => {
        mutate({ resource: "deals", id });
      },
    });
  };

  const dropdownItems = useMemo(() => {
    const items: MenuProps["items"] = [
      {
        label: "View Deal",
        key: "1",
        icon: <EyeOutlined />,
        onClick: () => edit("deals", id, "replace"),
      },
      {
        danger: true,
        label: "Delete Deal",
        key: "2",
        icon: <DeleteOutlined />,
        onClick: handleDelete,
      },
    ];
    return items;
  }, [id]);

  return (
    <ConfigProvider
      theme={{
        components: {
          Tag: { colorText: token.colorTextSecondary },
          Card: { headerBg: "transparent" },
        },
      }}
    >
      <Card
        size="small"
        title={<Text ellipsis={{ tooltip: title }}>{title}</Text>}
        onClick={() => edit("deals", id, "replace")}
        extra={
          <Dropdown
            trigger={["click"]}
            menu={{
              items: dropdownItems,
              onPointerDown: (e) => e.stopPropagation(),
              onClick: (e) => e.domEvent.stopPropagation(),
            }}
            placement="bottom"
            arrow={{ pointAtCenter: true }}
          >
            <Button
              type="text"
              shape="circle"
              icon={<MoreOutlined style={{ transform: "rotate(90deg)" }} />}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            />
          </Dropdown>
        }
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "8px",
          }}
        >
          <Space size={4}>
            <DollarOutlined style={{ color: token.colorTextSecondary }} />
            <Text strong>{formatIndianCurrency(value ?? 0)}</Text>
          </Space>
          {company && (
            <Tooltip title={company.name}>
              <CustomAvatar
                shape="square"
                name={company.name}
                src={company.avatarUrl}
              />
            </Tooltip>
          )}
        </div>
      </Card>
    </ConfigProvider>
  );
};

export const DealCardMemo = memo(DealCard, (prev, next) => {
  return (
    prev.id === next.id &&
    prev.title === next.title &&
    prev.value === next.value &&
    prev.company?.id === next.company?.id
  );
});
