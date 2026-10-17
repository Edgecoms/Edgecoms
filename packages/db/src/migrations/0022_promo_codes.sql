CREATE TABLE "promo_codes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"label" text,
	"status" "partner_code_status" DEFAULT 'active' NOT NULL,
	"max_redemptions" integer,
	"expires_at" timestamp,
	"discount_kind" "discount_kind" DEFAULT 'none' NOT NULL,
	"discount_bps" integer,
	"discount_amount_minor" bigint,
	"discount_currency" varchar(3),
	"discount_cycles" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "promo_codes_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "promo_redemptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"promo_code_id" uuid NOT NULL,
	"shop_domain" text NOT NULL,
	"app_slug" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "promo_redemptions_code_shop_app_uq" UNIQUE("promo_code_id","shop_domain","app_slug")
);
--> statement-breakpoint
ALTER TABLE "promo_redemptions" ADD CONSTRAINT "promo_redemptions_promo_code_id_promo_codes_id_fk" FOREIGN KEY ("promo_code_id") REFERENCES "public"."promo_codes"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "promo_redemptions_shop_idx" ON "promo_redemptions" USING btree ("shop_domain");