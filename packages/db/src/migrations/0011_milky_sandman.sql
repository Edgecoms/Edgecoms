CREATE TYPE "public"."payout_method" AS ENUM('bank_transfer', 'upi', 'wire', 'payment_link', 'other');--> statement-breakpoint
ALTER TABLE "payouts" ADD COLUMN "withheld_amount" bigint DEFAULT 0 NOT NULL;--> statement-breakpoint
-- Hand-edited: drizzle generated this as a single NOT NULL add, which fails on
-- a table that already has rows. Existing payouts predate withholding, so their
-- net is their total; add nullable, backfill, then constrain.
ALTER TABLE "payouts" ADD COLUMN "net_amount" bigint;--> statement-breakpoint
UPDATE "payouts" SET "net_amount" = "total_amount" - "withheld_amount" WHERE "net_amount" IS NULL;--> statement-breakpoint
ALTER TABLE "payouts" ALTER COLUMN "net_amount" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "payouts" ADD COLUMN "method" "payout_method";--> statement-breakpoint
ALTER TABLE "payouts" ADD COLUMN "settled_amount" bigint;--> statement-breakpoint
ALTER TABLE "payouts" ADD COLUMN "settled_currency" varchar(3);--> statement-breakpoint
ALTER TABLE "payouts" ADD COLUMN "withholding_note" text;