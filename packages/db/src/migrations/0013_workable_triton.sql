CREATE TYPE "public"."referral_device_type" AS ENUM('desktop', 'mobile', 'tablet', 'unknown');--> statement-breakpoint
CREATE TABLE "referral_clicks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"link_id" uuid,
	"partner_id" uuid NOT NULL,
	"app_slug" text,
	"sub_id" text,
	"ip_hash" text,
	"user_agent" text,
	"device_type" "referral_device_type" DEFAULT 'unknown' NOT NULL,
	"is_bot" boolean DEFAULT false NOT NULL,
	"is_unique" boolean DEFAULT false NOT NULL,
	"country" varchar(2),
	"referrer" text,
	"utm_source" text,
	"utm_medium" text,
	"utm_campaign" text,
	"utm_content" text,
	"utm_term" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "referral_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"partner_id" uuid NOT NULL,
	"app_slug" text,
	"sub_id" text,
	"slug" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "referral_links_slug_unique" UNIQUE("slug"),
	CONSTRAINT "referral_links_shape_uq" UNIQUE NULLS NOT DISTINCT("partner_id","app_slug","sub_id")
);
--> statement-breakpoint
ALTER TABLE "referral_clicks" ADD CONSTRAINT "referral_clicks_link_id_referral_links_id_fk" FOREIGN KEY ("link_id") REFERENCES "public"."referral_links"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referral_clicks" ADD CONSTRAINT "referral_clicks_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referral_links" ADD CONSTRAINT "referral_links_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "referral_clicks_link_created_idx" ON "referral_clicks" USING btree ("link_id","created_at");--> statement-breakpoint
CREATE INDEX "referral_clicks_ip_created_idx" ON "referral_clicks" USING btree ("ip_hash","created_at");--> statement-breakpoint
CREATE INDEX "referral_clicks_partner_created_idx" ON "referral_clicks" USING btree ("partner_id","created_at");--> statement-breakpoint
CREATE INDEX "referral_links_partner_idx" ON "referral_links" USING btree ("partner_id");