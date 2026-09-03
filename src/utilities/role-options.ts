import { Role } from "@/graphql/schema.types";

export const roleOptions: { label: string; value: Role }[] = [
  { label: "Sales Person", value: "SALES_PERSON" },
  { label: "Sales Manager", value: "SALES_MANAGER" },
  { label: "Sales Intern", value: "SALES_INTERN" },
  { label: "Admin", value: "ADMIN" },
];

export const MANAGER_ROLES: Role[] = ["ADMIN", "SALES_MANAGER"];

export const isManagerRole = (role?: Role | null): boolean =>
  !!role && MANAGER_ROLES.includes(role);
