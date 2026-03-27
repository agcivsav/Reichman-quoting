ALTER TABLE "profiles" ADD COLUMN "secondary_phone" text;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "same_as_billing" boolean DEFAULT false;