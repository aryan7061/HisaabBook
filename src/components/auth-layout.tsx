import { Col, Row } from "antd";
import logo from "@/assets/logo.png";

type Props = {
  children: React.ReactNode;
};

export const AuthLayout = ({ children }: Props) => {
  return (
    <Row style={{ minHeight: "100vh" }}>
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
