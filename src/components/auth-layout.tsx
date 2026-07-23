import { Col, Row } from "antd";
import logo from "@/assets/logo.png";
import SupportButton from "./layout/support-button";
import { LiveDemoButton } from "./live-demo-button";

type Props = {
  children: React.ReactNode;
  /** Shown on Login/Register; left off Forgot Password, where signing
   * into a demo account isn't a relevant action. Defaults to true. */
  showLiveDemo?: boolean;
};

export const AuthLayout = ({ children, showLiveDemo = true }: Props) => {
  return (
    <Row style={{ minHeight: "100vh", position: "relative" }}>
      <div style={{ position: "absolute", top: 24, right: 24, zIndex: 10 }}>
        <SupportButton />
      </div>
      <Col
        xs={0}
        md={10}
        style={{
          background: "#EDE3CF",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px",
          textAlign: "center",
        }}
      >
        <img
          src={logo}
          alt="HisaabBook"
          style={{
            width: 220,
            height: 220,
            objectFit: "cover",
            borderRadius: 16,
            marginBottom: "32px",
            boxShadow: "0 12px 32px rgba(59, 42, 32, 0.25)",
          }}
        />
        <h1
          style={{
            fontSize: "40px",
            color: "#3B2A20",
            margin: 0,
            fontWeight: 600,
          }}
        >
          HisaabBook
        </h1>
        <div
          style={{
            width: "48px",
            height: "3px",
            background: "#A66A3E",
            margin: "16px 0",
          }}
        />
        <p
          style={{
            fontSize: "16px",
            color: "#5C4D3E",
            maxWidth: "320px",
            margin: 0,
          }}
        >
          Every company, contact, deal, and task — kept in one ledger.
        </p>

        {showLiveDemo && (
          <div className="hb-demo-section">
            <LiveDemoButton />
            <p className="hb-demo-intro">
              Explore HisaabBook without signing up.
            </p>
            <div className="hb-demo-credentials">
              <p className="hb-demo-credentials-title">Demo Credentials</p>
              <span>
                Email: <code>aryan@gmail.com</code>
              </span>
              <span>
                Password: <code>123456</code>
              </span>
            </div>
            <p className="hb-demo-description">
              View companies, contacts, deals, tasks, analytics, and reports
              using sample data from the demo account.
            </p>
          </div>
        )}
      </Col>
      <Col
        xs={24}
        md={14}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FAFAFA",
        }}
      >
        {children}
      </Col>
    </Row>
  );
};
