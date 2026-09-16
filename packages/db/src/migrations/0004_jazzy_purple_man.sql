CREATE TYPE "public"."partner_invite_status" AS ENUM('sent', 'accepted', 'revoked');--> statement-breakpoint
CREATE TABLE "partner_invites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"token_hash" text NOT NULL,
	"proposed_rate_bps" integer,
	"company_name" text,
	"status" "partner_invite_status" DEFAULT 'sent' NOT NULL,
	"expires_at" timestamp NOT NULL,
	"invited_by" text NOT NULL,
	"accepted_at" timestamp,
	"accepted_partner_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "partner_invites_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
ALTER TABLE "partner_invites" ADD CONSTRAINT "partner_invites_invited_by_user_id_fk" FOREIGN KEY ("invited_by") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_invites" ADD CONSTRAINT "partner_invites_accepted_partner_id_partners_id_fk" FOREIGN KEY ("accepted_partner_id") REFERENCES "public"."partners"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "partner_invites_live_email_uq" ON "partner_invites" USING btree ("email") WHERE status = 'sent';--> statement-breakpoint
CREATE INDEX "partner_invites_email_idx" ON "partner_invites" USING btree ("email");--> statement-breakpoint
CREATE INDEX "partner_invites_status_idx" ON "partner_invites" USING btree ("status");