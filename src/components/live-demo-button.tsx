import { useState, type CSSProperties } from "react";
import { useLogin } from "@refinedev/core";
import { RocketOutlined, CheckCircleOutlined } from "@ant-design/icons";

const DEMO_EMAIL = "aryan@gmail.com";
const DEMO_PASSWORD = "123456";
const LABEL = "Live Demo";

type LoginVariables = {
  email: string;
  password: string;
};

export const LiveDemoButton = () => {
  const { mutate: login } = useLogin<LoginVariables>();
  const [status, setStatus] = useState<"idle" | "loading">("idle");

  const handleClick = () => {
    if (status === "loading") return;
    setStatus("loading");
    login(
      { email: DEMO_EMAIL, password: DEMO_PASSWORD },
      {
        onError: () => setStatus("idle"),
      },
    );
  };

  return (
    <button
      type="button"
      className={`hb-demo-btn${status === "loading" ? " is-loading" : ""}`}
      onClick={handleClick}
      disabled={status === "loading"}
      aria-label="Sign in to a live demo account with sample data"
    >
      <span className="hb-demo-outline" aria-hidden="true" />
      <span className="hb-demo-state hb-demo-state--default">
        <span className="hb-demo-icon" aria-hidden="true">
          <RocketOutlined />
        </span>
        <span className="hb-demo-label">
          {LABEL.split("").map((char, i) => (
            <span key={i} style={{ "--i": i } as CSSProperties}>
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </span>
      </span>
      <span className="hb-demo-state hb-demo-state--loading">
        <CheckCircleOutlined aria-hidden="true" />
        <span>Signing in…</span>
      </span>
    </button>
  );
};
