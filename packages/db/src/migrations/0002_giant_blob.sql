CREATE TABLE "course_leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"source" text DEFAULT 'course-landing' NOT NULL,
	"access_sent_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "course_leads_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE INDEX "course_leads_created_at_idx" ON "course_leads" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "course_leads_access_sent_at_idx" ON "course_leads" USING btree ("access_sent_at");