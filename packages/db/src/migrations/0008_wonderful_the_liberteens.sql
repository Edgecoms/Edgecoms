ALTER TABLE "partner_bonuses" ALTER COLUMN "issued_by" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "partner_bonuses" ADD COLUMN "milestone_key" text;--> statement-breakpoint
CREATE UNIQUE INDEX "partner_bonuses_milestone_uq" ON "partner_bonuses" USING btree ("partner_id","milestone_key");