CREATE TYPE "public"."partner_bonus_status" AS ENUM('pending', 'paid', 'revoked');--> statement-breakpoint
CREATE TABLE "partner_bonuses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"partner_id" uuid NOT NULL,
	"amount" bigint NOT NULL,
	"currency" varchar(3) NOT NULL,
	"reason" text NOT NULL,
	"period_month" text NOT NULL,
	"status" "partner_bonus_status" DEFAULT 'pending' NOT NULL,
	"payout_id" uuid,
	"paid_at" timestamp,
	"issued_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "partner_bonuses" ADD CONSTRAINT "partner_bonuses_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_bonuses" ADD CONSTRAINT "partner_bonuses_payout_id_payouts_id_fk" FOREIGN KEY ("payout_id") REFERENCES "public"."payouts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_bonuses" ADD CONSTRAINT "partner_bonuses_issued_by_user_id_fk" FOREIGN KEY ("issued_by") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "partner_bonuses_partner_idx" ON "partner_bonuses" USING btree ("partner_id");--> statement-breakpoint
CREATE INDEX "partner_bonuses_payable_idx" ON "partner_bonuses" USING btree ("partner_id","period_month","currency","status");