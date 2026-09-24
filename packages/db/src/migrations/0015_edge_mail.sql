CREATE TYPE "public"."mail_campaign_status" AS ENUM('draft', 'importing', 'scheduled', 'sent', 'failed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."mail_campaign_type" AS ENUM('product_update', 'announcement', 'education', 'marketing', 'discount', 'cross_sell', 'winback');--> statement-breakpoint
CREATE TYPE "public"."mail_category" AS ENUM('product_updates', 'marketing', 'education');--> statement-breakpoint
CREATE TYPE "public"."mail_install_status" AS ENUM('installed', 'active', 'inactive', 'uninstalled');--> statement-breakpoint
CREATE TYPE "public"."mail_suppression_reason" AS ENUM('bounced', 'complained');--> statement-breakpoint
CREATE TABLE "mail_app_settings" (
	"app_id" uuid PRIMARY KEY NOT NULL,
	"sender_name" text NOT NULL,
	"sender_email" text NOT NULL,
	"reply_to" text,
	"brand_color" text NOT NULL,
	"logo_url" text,
	"app_url" text,
	"support_url" text,
	"review_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mail_campaign_recipients" (
	"campaign_id" uuid NOT NULL,
	"contact_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "mail_campaign_recipients_campaign_id_contact_id_pk" PRIMARY KEY("campaign_id","contact_id")
);
--> statement-breakpoint
CREATE TABLE "mail_campaigns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"type" "mail_campaign_type" NOT NULL,
	"category" "mail_category" NOT NULL,
	"app_id" uuid NOT NULL,
	"subject" text NOT NULL,
	"preheader" text NOT NULL,
	"eyebrow" text,
	"headline" text NOT NULL,
	"body" text NOT NULL,
	"cta_label" text,
	"cta_url" text,
	"audience" jsonb NOT NULL,
	"status" "mail_campaign_status" DEFAULT 'draft' NOT NULL,
	"content_updated_at" timestamp DEFAULT now() NOT NULL,
	"test_sent_at" timestamp,
	"recipient_count" integer,
	"resend_segment_id" text,
	"resend_import_id" text,
	"resend_broadcast_id" text,
	"scheduled_at" timestamp,
	"sent_at" timestamp,
	"failure_reason" text,
	"created_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mail_contact_stores" (
	"contact_id" uuid NOT NULL,
	"store_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "mail_contact_stores_contact_id_store_id_pk" PRIMARY KEY("contact_id","store_id")
);
--> statement-breakpoint
CREATE TABLE "mail_contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"first_name" text,
	"last_name" text,
	"resend_contact_id" text,
	"product_updates" boolean DEFAULT false NOT NULL,
	"marketing" boolean DEFAULT false NOT NULL,
	"education" boolean DEFAULT false NOT NULL,
	"suppressed_at" timestamp,
	"suppression_reason" "mail_suppression_reason",
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "mail_contacts_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "mail_email_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"svix_id" text NOT NULL,
	"resend_email_id" text,
	"type" text NOT NULL,
	"email" text,
	"contact_id" uuid,
	"campaign_id" uuid,
	"app_id" uuid,
	"payload" jsonb NOT NULL,
	"occurred_at" timestamp NOT NULL,
	"received_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "mail_email_events_svix_id_unique" UNIQUE("svix_id")
);
--> statement-breakpoint
CREATE TABLE "mail_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" text NOT NULL,
	"app_id" uuid NOT NULL,
	"store_id" uuid NOT NULL,
	"contact_id" uuid,
	"type" text NOT NULL,
	"payload" jsonb NOT NULL,
	"occurred_at" timestamp NOT NULL,
	"received_at" timestamp DEFAULT now() NOT NULL,
	"resend_synced_at" timestamp,
	CONSTRAINT "mail_events_event_id_unique" UNIQUE("event_id")
);
--> statement-breakpoint
CREATE TABLE "mail_installations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_id" uuid NOT NULL,
	"app_id" uuid NOT NULL,
	"status" "mail_install_status" NOT NULL,
	"plan" text,
	"installed_at" timestamp,
	"activated_at" timestamp,
	"setup_completed_at" timestamp,
	"uninstalled_at" timestamp,
	"last_active_at" timestamp,
	"status_changed_at" timestamp NOT NULL,
	"plan_changed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "mail_installations_store_app_unique" UNIQUE("store_id","app_id")
);
--> statement-breakpoint
CREATE TABLE "mail_stores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"shop_domain" text NOT NULL,
	"name" text,
	"country" text,
	"currency" text,
	"timezone" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "mail_stores_shop_domain_unique" UNIQUE("shop_domain")
);
--> statement-breakpoint
ALTER TABLE "mail_app_settings" ADD CONSTRAINT "mail_app_settings_app_id_apps_id_fk" FOREIGN KEY ("app_id") REFERENCES "public"."apps"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mail_campaign_recipients" ADD CONSTRAINT "mail_campaign_recipients_campaign_id_mail_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."mail_campaigns"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mail_campaign_recipients" ADD CONSTRAINT "mail_campaign_recipients_contact_id_mail_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."mail_contacts"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mail_campaigns" ADD CONSTRAINT "mail_campaigns_app_id_apps_id_fk" FOREIGN KEY ("app_id") REFERENCES "public"."apps"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mail_campaigns" ADD CONSTRAINT "mail_campaigns_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mail_contact_stores" ADD CONSTRAINT "mail_contact_stores_contact_id_mail_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."mail_contacts"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mail_contact_stores" ADD CONSTRAINT "mail_contact_stores_store_id_mail_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."mail_stores"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mail_email_events" ADD CONSTRAINT "mail_email_events_contact_id_mail_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."mail_contacts"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mail_email_events" ADD CONSTRAINT "mail_email_events_campaign_id_mail_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."mail_campaigns"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mail_email_events" ADD CONSTRAINT "mail_email_events_app_id_apps_id_fk" FOREIGN KEY ("app_id") REFERENCES "public"."apps"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mail_events" ADD CONSTRAINT "mail_events_app_id_apps_id_fk" FOREIGN KEY ("app_id") REFERENCES "public"."apps"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mail_events" ADD CONSTRAINT "mail_events_store_id_mail_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."mail_stores"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mail_events" ADD CONSTRAINT "mail_events_contact_id_mail_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."mail_contacts"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mail_installations" ADD CONSTRAINT "mail_installations_store_id_mail_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."mail_stores"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mail_installations" ADD CONSTRAINT "mail_installations_app_id_apps_id_fk" FOREIGN KEY ("app_id") REFERENCES "public"."apps"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "mail_campaigns_status_idx" ON "mail_campaigns" USING btree ("status");--> statement-breakpoint
CREATE INDEX "mail_contact_stores_store_idx" ON "mail_contact_stores" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX "mail_email_events_campaign_idx" ON "mail_email_events" USING btree ("campaign_id");--> statement-breakpoint
CREATE INDEX "mail_email_events_type_occurred_idx" ON "mail_email_events" USING btree ("type","occurred_at");--> statement-breakpoint
CREATE INDEX "mail_email_events_contact_idx" ON "mail_email_events" USING btree ("contact_id");--> statement-breakpoint
CREATE INDEX "mail_events_contact_idx" ON "mail_events" USING btree ("contact_id");--> statement-breakpoint
CREATE INDEX "mail_events_store_idx" ON "mail_events" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX "mail_installations_app_status_idx" ON "mail_installations" USING btree ("app_id","status");