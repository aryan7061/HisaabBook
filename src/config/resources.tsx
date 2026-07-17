import {
  DashboardOutlined,
  DollarOutlined,
  ProjectOutlined,
  ShopOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { IResourceItem } from "@refinedev/core";

export const resources: IResourceItem[] = [
  {
    name: "dashboard",
    list: "/",
    meta: {
      label: "Dashboard",
      icon: <DashboardOutlined />,
    },
  },
  {
    name: "companies",
    list: "/companies",
    show: "/companies/:id",
    create: "/companies/new",
    edit: "/companies/edit/:id",
    meta: {
      label: "Companies",
      icon: <ShopOutlined />,
    },
  },
  {
    name: "contacts",
    list: "/contacts",
    create: "/contacts/new",
    edit: "/contacts/edit/:id",
    meta: {
      label: "Contacts",
      icon: <TeamOutlined />,
    },
  },
  {
    name: "deals",
    list: "/deals",
    create: "/deals/new",
    edit: "/deals/edit/:id",
    meta: {
      label: "Deals",
      icon: <DollarOutlined />,
    },
  },
  {
    name: "tasks",
    list: "/tasks",
    create: "/tasks/new",
    edit: "/tasks/edit/:id",
    meta: {
      label: "Tasks",
      icon: <ProjectOutlined />,
    },
  },
];
