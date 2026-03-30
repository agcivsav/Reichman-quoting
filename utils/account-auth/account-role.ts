export const accountRoles = ["admin", "customer", "sales_representative"] as const;

export type AccountRole = (typeof accountRoles)[number];

export function isAccountRole(value: unknown): value is AccountRole {
  return typeof value === "string" && accountRoles.includes(value as AccountRole);
}

export function getHomePathForRole(role: AccountRole) {
  return role === "admin" ? "/dashboard" : "/account";
}
