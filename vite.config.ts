import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          if (id.includes("exceljs")) return "exceljs";
          if (id.includes("@antv") || id.includes("@ant-design/plots"))
            return "charts";
          if (id.includes("@uiw/react-md-editor")) return "md-editor";
          if (id.includes("@refinedev")) return "refine";
          if (
            id.includes("/antd/") ||
            id.includes("@ant-design/") ||
            id.includes("/rc-")
          )
            return "antd";
          if (
            id.includes("/react-router/") ||
            id.includes("/react-dom/") ||
            id.includes("/react/") ||
            id.includes("/scheduler/")
          )
            return "react";

          return "vendor";
        },
      },
    },
  },
});
