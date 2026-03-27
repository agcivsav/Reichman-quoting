import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

export const licenseTypes = pgTable("license_types", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(), // 'Private Applicator'
  description: text("description"), // optional details
  sortOrder: integer("sort_order").default(0), // control dropdown order
  isActive: boolean("is_active").default(true), // soft disable without deleting
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
