import { pgEnum } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("user_role", [
  "admin",
  "customer",
  "sales_representative",
]);

export const addressTypeEnum = pgEnum("address_type", ["billing", "shipping"]);