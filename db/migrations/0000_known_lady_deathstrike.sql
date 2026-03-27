CREATE TYPE "public"."address_type" AS ENUM('billing', 'shipping');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'customer', 'sales_representative');--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"role" "user_role" DEFAULT 'customer' NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"phone" text,
	"company_name" text,
	"is_onboarded" boolean DEFAULT false,
	"role_updated_at" timestamp,
	"role_updated_by" uuid,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "addresses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "address_type" NOT NULL,
	"line1" text NOT NULL,
	"line2" text,
	"city" text NOT NULL,
	"state" text,
	"postal_code" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "addresses_user_id_type_unique" UNIQUE("user_id","type")
);
--> statement-breakpoint
CREATE TABLE "licenses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"license_type_id" uuid,
	"license_number" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"state" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "licenses_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "license_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "licenses" ADD CONSTRAINT "licenses_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "licenses" ADD CONSTRAINT "licenses_license_type_id_license_types_id_fk" FOREIGN KEY ("license_type_id") REFERENCES "public"."license_types"("id") ON DELETE no action ON UPDATE no action;