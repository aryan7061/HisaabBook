import { Skeleton } from "antd";

const AccordionHeaderSkeleton = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--hb-space-2)",
        padding: "var(--hb-space-3) var(--hb-space-5)",
        borderBottom: "1px solid var(--hb-divider)",
      }}
    >
      <Skeleton.Avatar size="small" shape="square" />
      <Skeleton.Input size="small" block style={{ height: "22px" }} />
    </div>
  );
};

export default AccordionHeaderSkeleton;
