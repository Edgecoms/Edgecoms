CREATE TYPE "public"."code_attempt_outcome" AS ENUM('bound', 'already_bound', 'claimed_by_other', 'invalid', 'rate_limited');--> statement-breakpoint
CREATE TYPE "public"."merchant_source" AS ENUM('manual', 'code');--> statement-breakpoint
CREATE TYPE "public"."partner_code_status" AS ENUM('active', 'disabled');--> statement-breakpoint
CREATE TABLE "code_redemption_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"shop_domain" text NOT NULL,
	"app_slug" text,
	"outcome" "code_attempt_outcome" NOT NULL,
	"reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "merchant_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"idempotency_key" text NOT NULL,
	"shop_domain" text NOT NULL,
	"merchant_id" uuid,
	"app_slug" text NOT NULL,
	"app_id" uuid,
	"type" text NOT NULL,
	"plan_handle" text,
	"occurred_at" timestamp NOT NULL,
	"received_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "merchant_events_idempotency_key_unique" UNIQUE("idempotency_key")
);
--> statement-breakpoint
CREATE TABLE "partner_codes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"partner_id" uuid NOT NULL,
	"code" text NOT NULL,
	"label" text,
	"status" "partner_code_status" DEFAULT 'active' NOT NULL,
	"max_redemptions" integer,
	"expires_at" timestamp,
	"perk_usage_allowance_usd" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "partner_codes_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "merchants" ADD COLUMN "source" "merchant_source" DEFAULT 'manual' NOT NULL;--> statement-breakpoint
ALTER TABLE "merchants" ADD COLUMN "partner_code_id" uuid;--> statement-breakpoint
ALTER TABLE "merchants" ADD COLUMN "source_code" text;--> statement-breakpoint
ALTER TABLE "merchants" ADD COLUMN "shopify_gid" text;--> statement-breakpoint
ALTER TABLE "merchant_events" ADD CONSTRAINT "merchant_events_merchant_id_merchants_id_fk" FOREIGN KEY ("merchant_id") REFERENCES "public"."merchants"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "merchant_events" ADD CONSTRAINT "merchant_events_app_id_apps_id_fk" FOREIGN KEY ("app_id") REFERENCES "public"."apps"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_codes" ADD CONSTRAINT "partner_codes_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "code_redemption_attempts_shop_idx" ON "code_redemption_attempts" USING btree ("shop_domain","created_at");--> statement-breakpoint
CREATE INDEX "code_redemption_attempts_code_idx" ON "code_redemption_attempts" USING btree ("code");--> statement-breakpoint
CREATE INDEX "merchant_events_merchant_idx" ON "merchant_events" USING btree ("merchant_id");--> statement-breakpoint
CREATE INDEX "merchant_events_shop_domain_idx" ON "merchant_events" USING btree ("shop_domain");--> statement-breakpoint
CREATE INDEX "merchant_events_occurred_at_idx" ON "merchant_events" USING btree ("occurred_at");--> statement-breakpoint
CREATE INDEX "partner_codes_partner_idx" ON "partner_codes" USING btree ("partner_id");--> statement-breakpoint
CREATE INDEX "partner_codes_status_idx" ON "partner_codes" USING btree ("status");--> statement-breakpoint
ALTER TABLE "merchants" ADD CONSTRAINT "merchants_partner_code_id_partner_codes_id_fk" FOREIGN KEY ("partner_code_id") REFERENCES "public"."partner_codes"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "merchants_partner_code_idx" ON "merchants" USING btree ("partner_code_id");