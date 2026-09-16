-- Hand-edited. Drizzle generated a single `DEFAULT now() NOT NULL` add, which
-- would stamp TODAY onto every store that already exists: their claim would
-- start now, and any charge of theirs not yet turned into a commission would be
-- silently cut off. An existing store's claim starts when it was bound, so
-- backfill from created_at before the default and the constraint go on.
ALTER TABLE "merchants" ADD COLUMN "earnings_from_at" timestamp;--> statement-breakpoint
UPDATE "merchants" SET "earnings_from_at" = "created_at" WHERE "earnings_from_at" IS NULL;--> statement-breakpoint
ALTER TABLE "merchants" ALTER COLUMN "earnings_from_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "merchants" ALTER COLUMN "earnings_from_at" SET NOT NULL;