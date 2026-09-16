CREATE TYPE "public"."payout_destination_kind" AS ENUM('bank_in', 'bank_intl');--> statement-breakpoint
ALTER TABLE "partners" ADD COLUMN "payout_destination" "payout_destination_kind";--> statement-breakpoint
ALTER TABLE "partners" ADD COLUMN "payout_account_name" text;--> statement-breakpoint
ALTER TABLE "partners" ADD COLUMN "payout_account_number" text;--> statement-breakpoint
ALTER TABLE "partners" ADD COLUMN "payout_ifsc" text;--> statement-breakpoint
ALTER TABLE "partners" ADD COLUMN "payout_country" varchar(2);