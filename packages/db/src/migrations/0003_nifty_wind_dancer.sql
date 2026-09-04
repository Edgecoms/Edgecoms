CREATE TABLE "marketing_leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"product" text NOT NULL,
	"source" text NOT NULL,
	"store_url" text,
	"playbook_sent_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "marketing_leads_email_idx" ON "marketing_leads" USING btree ("email");--> statement-breakpoint
CREATE INDEX "marketing_leads_product_idx" ON "marketing_leads" USING btree ("product","source","created_at");