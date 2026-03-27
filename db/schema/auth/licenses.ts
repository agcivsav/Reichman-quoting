import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core'
import { profiles } from './profiles'
import { licenseTypes } from './license-types'

export const licenses = pgTable('licenses', {
  id:            uuid('id').primaryKey().defaultRandom(),
  userId:        uuid('user_id').notNull().unique()
                   .references(() => profiles.id, { onDelete: 'cascade' }),

  // ─── License Info ──────────────────────────────
  licenseTypeId: uuid('license_type_id')
                   .references(() => licenseTypes.id),
  licenseNumber: text('license_number').notNull(),
  expiresAt:     timestamp('expires_at').notNull(),
  state:         text('state').notNull(),              // ISO 3166-2 alpha-2 e.g. 'US-CA', 'PK-PB'

  createdAt:     timestamp('created_at').defaultNow(),
  updatedAt:     timestamp('updated_at').defaultNow(),
})