ALTER TABLE "mail_events" DROP CONSTRAINT "mail_events_event_id_unique";--> statement-breakpoint
ALTER TABLE "mail_events" ADD CONSTRAINT "mail_events_app_event_unique" UNIQUE("app_id","event_id");