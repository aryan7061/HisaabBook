import React from "react";

import { PlusSquareOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { Text } from "@/components/text";

interface Props {
  onClick: () => void;
}

export const KanbanAddCardButton = ({
  children,
  onClick,
}: React.PropsWithChildren<Props>) => {
  return (
    <Button
      size="large"
      className="hb-add-card-btn"
      icon={<PlusSquareOutlined className="md" />}
      onClick={onClick}
    >
      {children ?? (
        <Text size="md" type="secondary">
          Add new card
        </Text>
      )}
    </Button>
  );
};
