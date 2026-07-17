import { AuditOutlined, ShopOutlined, TeamOutlined } from "@ant-design/icons";

const IconWrapper = ({
  color,
  children,
}: React.PropsWithChildren<{ color: string }>) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "32px",
        height: "32px",
        borderRadius: "50%",
        backgroundColor: color,
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
    secondaryColor: "#F3EADD",
    icon: (
      <IconWrapper color="#F8F2E7">
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
    primaryColor: "#B2643C",
    secondaryColor: "#F5E1D3",
    icon: (
      <IconWrapper color="#FBEFE6">
        <TeamOutlined
          className="md"
          style={{
            color: "#B2643C",
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
    primaryColor: "#6B7A4F",
    secondaryColor: "#E8EDDD",
    icon: (
      <IconWrapper color="#F1F4EA">
        <AuditOutlined
          className="md"
          style={{
            color: "#6B7A4F",
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
