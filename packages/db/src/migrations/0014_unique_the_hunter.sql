CREATE TYPE "public"."referral_claim_status" AS ENUM('pending', 'converted', 'expired', 'rejected', 'suggested');--> statement-breakpoint
ALTER TYPE "public"."merchant_source" ADD VALUE 'link';--> statement-breakpoint
CREATE TABLE "referral_claims" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"shop_domain" text NOT NULL,
	"partner_id" uuid NOT NULL,
	"link_id" uuid,
	"app_slug" text,
	"click_id" uuid,
	"status" "referral_claim_status" DEFAULT 'pending' NOT NULL,
	"expires_at" timestamp NOT NULL,
	"converted_merchant_id" uuid,
	"converted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "referral_claims" ADD CONSTRAINT "referral_claims_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referral_claims" ADD CONSTRAINT "referral_claims_link_id_referral_links_id_fk" FOREIGN KEY ("link_id") REFERENCES "public"."referral_links"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referral_claims" ADD CONSTRAINT "referral_claims_click_id_referral_clicks_id_fk" FOREIGN KEY ("click_id") REFERENCES "public"."referral_clicks"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referral_claims" ADD CONSTRAINT "referral_claims_converted_merchant_id_merchants_id_fk" FOREIGN KEY ("converted_merchant_id") REFERENCES "public"."merchants"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "referral_claims_shop_status_idx" ON "referral_claims" USING btree ("shop_domain","status");--> statement-breakpoint
CREATE INDEX "referral_claims_partner_created_idx" ON "referral_claims" USING btree ("partner_id","created_at");--> statement-breakpoint
CREATE INDEX "referral_claims_status_expires_idx" ON "referral_claims" USING btree ("status","expires_at");