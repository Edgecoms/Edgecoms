CREATE TYPE "public"."discount_kind" AS ENUM('none', 'percentage', 'fixed', 'free_cycles');--> statement-breakpoint
ALTER TABLE "merchants" ADD COLUMN "discount_kind" "discount_kind" DEFAULT 'none' NOT NULL;--> statement-breakpoint
ALTER TABLE "merchants" ADD COLUMN "discount_bps" integer;--> statement-breakpoint
ALTER TABLE "merchants" ADD COLUMN "discount_amount_minor" bigint;--> statement-breakpoint
ALTER TABLE "merchants" ADD COLUMN "discount_currency" varchar(3);--> statement-breakpoint
ALTER TABLE "merchants" ADD COLUMN "discount_cycles" integer;--> statement-breakpoint
ALTER TABLE "merchants" ADD COLUMN "discount_granted_at" timestamp;--> statement-breakpoint
ALTER TABLE "partner_codes" ADD COLUMN "discount_kind" "discount_kind" DEFAULT 'none' NOT NULL;--> statement-breakpoint
ALTER TABLE "partner_codes" ADD COLUMN "discount_bps" integer;--> statement-breakpoint
ALTER TABLE "partner_codes" ADD COLUMN "discount_amount_minor" bigint;--> statement-breakpoint
ALTER TABLE "partner_codes" ADD COLUMN "discount_currency" varchar(3);--> statement-breakpoint
ALTER TABLE "partner_codes" ADD COLUMN "discount_cycles" integer;--> statement-breakpoint
ALTER TABLE "partner_codes" ADD COLUMN "discount_grant_limit" integer;--> statement-breakpoint
CREATE INDEX "merchants_partner_grant_idx" ON "merchants" USING btree ("partner_id","discount_granted_at");