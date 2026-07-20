import { theme as antdTheme } from "antd";

export const hisaabBookTheme = {
  algorithm: antdTheme.darkAlgorithm,
  token: {
    colorPrimary: "#B08D57",
    colorPrimaryHover: "#B08D57",
    colorPrimaryActive: "#9A7A4A",
    colorInfo: "#6B7A99",
    colorLink: "#B08D57",
    colorLinkHover: "#C9A868",
    colorSuccess: "#7FA872",
    colorError: "#C97A6D",
    colorWarning: "#D6A756",
    colorBgBase: "#14120F",
    colorBgContainer: "#1C1915",
    colorBgElevated: "#221E18",
    colorBgLayout: "#14120F",
    colorBorder: "rgba(176, 141, 87, 0.16)",
    colorBorderSecondary: "rgba(176, 141, 87, 0.12)",
    colorText: "#F0E9DC",
    colorTextSecondary: "#9C9184",
    colorTextTertiary: "#736A5E",
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    borderRadius: 8,
  },
  components: {
    Table: {
      headerBg: "#221E18",
      rowHoverBg: "rgba(176, 141, 87, 0.12)",
    },
    Menu: {
      itemSelectedBg: "rgba(176, 141, 87, 0.18)",
      itemSelectedColor: "#F0E9DC",
      itemHoverBg: "rgba(176, 141, 87, 0.16)",
      itemHoverColor: "#F0E9DC",
    },
    Card: {
      colorBgContainer: "#1C1915",
    },
    Layout: {
      headerBg: "#1C1915",
      siderBg: "#1C1915",
      bodyBg: "#14120F",
    },
    Modal: {
      contentBg: "#1C1915",
      headerBg: "#1C1915",
    },
  },
};
