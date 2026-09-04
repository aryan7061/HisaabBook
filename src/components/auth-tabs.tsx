import { Link } from "react-router";

type Props = {
  active: "login" | "register";
};

export const AuthTabs = ({ active }: Props) => {
  const tabStyle = (isActive: boolean): React.CSSProperties => ({
    fontWeight: 600,
    fontSize: "16px",
    color: isActive ? "var(--hb-gold)" : "var(--hb-text-secondary)",
    borderBottom: isActive
      ? "2px solid var(--hb-gold)"
      : "2px solid transparent",
    paddingBottom: "var(--hb-space-2)",
    textDecoration: "none",
    transition: "color 0.2s ease, border-color 0.2s ease",
  });

  return (
    <div
      style={{
        display: "flex",
        gap: "var(--hb-space-5)",
        justifyContent: "center",
        marginBottom: "var(--hb-space-5)",
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
