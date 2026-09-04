import { getNameInitials } from "@/utilities";
import { Avatar as AntdAvatar, AvatarProps } from "antd";

type Props = AvatarProps & {
  name: string;
};

const CustomAvatar = ({ name, style, className, ...rest }: Props) => {
  return (
    <AntdAvatar
      alt={name}
      size="small"
      className={className ? `hb-avatar ${className}` : "hb-avatar"}
      style={{
        display: "flex",
        alignItems: "center",
        ...style,
      }}
      {...rest}
    >
      {getNameInitials(name || "")}
    </AntdAvatar>
  );
};

export default CustomAvatar;
