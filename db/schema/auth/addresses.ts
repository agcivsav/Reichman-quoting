import { pgTable, uuid, text, timestamp, unique } from "drizzle-orm/pg-core";
import { addressTypeEnum } from "../enums";
import { profiles } from "./profiles";

export const addresses = pgTable(
  "addresses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    type: addressTypeEnum("type").notNull(),
    line1: text("line1").notNull(),
    line2: text("line2"),
    city: text("city").notNull(),
    state: text("state"),
    postalCode: text("postal_code").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => ({
    uniqueUserType: unique().on(t.userId, t.type),
  }),
);
