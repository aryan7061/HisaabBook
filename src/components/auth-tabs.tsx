import { Link } from "react-router";

type Props = {
  active: "login" | "register";
};

export const AuthTabs = ({ active }: Props) => {
  const tabStyle = (isActive: boolean): React.CSSProperties => ({
    fontWeight: 600,
    fontSize: "16px",
    color: isActive ? "#B08D57" : "#8c8c8c",
    borderBottom: isActive ? "2px solid #B08D57" : "2px solid transparent",
    paddingBottom: "8px",
    textDecoration: "none",
  });

  return (
    <div
      style={{
        display: "flex",
        gap: "24px",
        justifyContent: "center",
        marginBottom: "24px",
      }}
    >
      <Link to="/login" style={tabStyle(active === "login")}>
        Login
      </Link>
      <Link to="/register" style={tabStyle(active === "register")}>
        Sign up
      </Link>
    </div>
  );
};
