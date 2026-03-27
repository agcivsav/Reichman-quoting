import { pgTable, uuid, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { roleEnum } from "../enums";

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  role: roleEnum("role").default("customer").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone"),
  companyName: text("company_name"),
  isOnboarded: boolean("is_onboarded").default(false),
  roleUpdatedAt: timestamp("role_updated_at"),
  roleUpdatedBy: uuid("role_updated_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
