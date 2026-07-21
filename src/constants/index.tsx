import { AuditOutlined, ShopOutlined, TeamOutlined } from "@ant-design/icons";

export const IconWrapper = ({
  color,
  glow,
  shape = "circle",
  children,
}: React.PropsWithChildren<{
  color: string;
  glow: string;
  shape?: "circle" | "square";
}>) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "32px",
        height: "32px",
        borderRadius: shape === "square" ? "8px" : "50%",
        backgroundColor: color,
        border: `1px solid ${glow}`,
        boxShadow: `0 0 10px ${glow}`,
      }}
    >
      {children}
    </div>
  );
};

import { BusinessType, CompanySize, Contact } from "@/graphql/schema.types";

export type TotalCountType = "companies" | "contacts" | "deals";

export const totalCountVariants: {
  [key in TotalCountType]: {
    primaryColor: string;
    secondaryColor?: string;
    icon: React.ReactNode;
    title: string;
    data: { index: string; value: number }[];
  };
} = {
  companies: {
    primaryColor: "#B08D57",
    secondaryColor: "rgba(176, 141, 87, 0.28)",
    icon: (
      <IconWrapper
        color="rgba(176, 141, 87, 0.1)"
        glow="rgba(176, 141, 87, 0.3)"
      >
        <ShopOutlined
          className="md"
          style={{
            color: "#B08D57",
          }}
        />
      </IconWrapper>
    ),
    title: "Number of companies",
    data: [
      { index: "1", value: 3500 },
      { index: "2", value: 2750 },
      { index: "3", value: 5000 },
      { index: "4", value: 4250 },
      { index: "5", value: 5000 },
    ],
  },
  contacts: {
    primaryColor: "#B36B6B",
    secondaryColor: "rgba(179, 107, 107, 0.28)",
    icon: (
      <IconWrapper
        color="rgba(179, 107, 107, 0.1)"
        glow="rgba(179, 107, 107, 0.3)"
      >
        <TeamOutlined
          className="md"
          style={{
            color: "#B36B6B",
          }}
        />
      </IconWrapper>
    ),
    title: "Number of contacts",
    data: [
      { index: "1", value: 10000 },
      { index: "2", value: 19500 },
      { index: "3", value: 13000 },
      { index: "4", value: 17000 },
      { index: "5", value: 13000 },
      { index: "6", value: 20000 },
    ],
  },
  deals: {
    primaryColor: "#6B9B5E",
    secondaryColor: "rgba(107, 155, 94, 0.28)",
    icon: (
      <IconWrapper
        color="rgba(107, 155, 94, 0.1)"
        glow="rgba(107, 155, 94, 0.3)"
      >
        <AuditOutlined
          className="md"
          style={{
            color: "#6B9B5E",
          }}
        />
      </IconWrapper>
    ),
    title: "Total deals in pipeline",
    data: [
      { index: "1", value: 1000 },
      { index: "2", value: 1300 },
      { index: "3", value: 1200 },
      { index: "4", value: 2000 },
      { index: "5", value: 800 },
      { index: "6", value: 1700 },
      { index: "7", value: 1400 },
      { index: "8", value: 1800 },
    ],
  },
};

export const statusOptions: {
  label: string;
  value: Contact["status"];
}[] = [
  { label: "New", value: "NEW" },
  { label: "Qualified", value: "QUALIFIED" },
  { label: "Unqualified", value: "UNQUALIFIED" },
  { label: "Won", value: "WON" },
  { label: "Negotiation", value: "NEGOTIATION" },
  { label: "Lost", value: "LOST" },
  { label: "Interested", value: "INTERESTED" },
  { label: "Contacted", value: "CONTACTED" },
  { label: "Churned", value: "CHURNED" },
];

export const companySizeOptions: {
  label: string;
  value: CompanySize;
}[] = [
  { label: "Enterprise", value: "ENTERPRISE" },
  { label: "Large", value: "LARGE" },
  { label: "Medium", value: "MEDIUM" },
  { label: "Small", value: "SMALL" },
];

export const businessTypeOptions: {
  label: string;
  value: BusinessType;
}[] = [
  { label: "B2B", value: "B2B" },
  { label: "B2C", value: "B2C" },
  { label: "B2G", value: "B2G" },
];

export const countryOptions: { label: string; value: string }[] = [
  { label: "Afghanistan", value: "Afghanistan" },
  { label: "Australia", value: "Australia" },
  { label: "Bangladesh", value: "Bangladesh" },
  { label: "Brazil", value: "Brazil" },
  { label: "Canada", value: "Canada" },
  { label: "China", value: "China" },
  { label: "France", value: "France" },
  { label: "Germany", value: "Germany" },
  { label: "India", value: "India" },
  { label: "Indonesia", value: "Indonesia" },
  { label: "Italy", value: "Italy" },
  { label: "Japan", value: "Japan" },
  { label: "Mexico", value: "Mexico" },
  { label: "Netherlands", value: "Netherlands" },
  { label: "New Zealand", value: "New Zealand" },
  { label: "Nigeria", value: "Nigeria" },
  { label: "Pakistan", value: "Pakistan" },
  { label: "Russia", value: "Russia" },
  { label: "Saudi Arabia", value: "Saudi Arabia" },
  { label: "Singapore", value: "Singapore" },
  { label: "South Africa", value: "South Africa" },
  { label: "South Korea", value: "South Korea" },
  { label: "Spain", value: "Spain" },
  { label: "Sweden", value: "Sweden" },
  { label: "Turkey", value: "Turkey" },
  { label: "United Arab Emirates", value: "United Arab Emirates" },
  { label: "United Kingdom", value: "United Kingdom" },
  { label: "United States", value: "United States" },
];
