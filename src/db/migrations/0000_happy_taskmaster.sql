CREATE TYPE "public"."found_status" AS ENUM('pending_verification', 'verified', 'resolved', 'archived');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('male', 'female', 'unknown');--> statement-breakpoint
CREATE TYPE "public"."match_status" AS ENUM('potential', 'reviewed', 'confirmed', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."missing_status" AS ENUM('active', 'found', 'closed', 'archived');--> statement-breakpoint
CREATE TABLE "found_children" (
	"id" text PRIMARY KEY NOT NULL,
	"estimated_age" varchar(50) NOT NULL,
	"gender" "gender",
	"physical_description" text NOT NULL,
	"special_characteristics" text,
	"location_found" text NOT NULL,
	"date_found" varchar(20) NOT NULL,
	"time_found" varchar(10),
	"current_status" varchar(100) NOT NULL,
	"additional_details" text,
	"reporter_name" varchar(255) NOT NULL,
	"reporter_email" varchar(255) NOT NULL,
	"reporter_phone" varchar(50) NOT NULL,
	"organization" varchar(255),
	"status" "found_status" DEFAULT 'pending_verification' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "missing_children" (
	"id" text PRIMARY KEY NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"date_of_birth" varchar(20) NOT NULL,
	"gender" "gender",
	"physical_description" text NOT NULL,
	"last_seen_location" text NOT NULL,
	"last_seen_date" varchar(20) NOT NULL,
	"last_seen_time" varchar(10),
	"circumstances" text,
	"reporter_name" varchar(255) NOT NULL,
	"reporter_email" varchar(255) NOT NULL,
	"reporter_phone" varchar(50) NOT NULL,
	"relationship" varchar(100) NOT NULL,
	"status" "missing_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "child_matches" (
	"id" text PRIMARY KEY NOT NULL,
	"found_child_id" text NOT NULL,
	"missing_child_id" text NOT NULL,
	"score" integer NOT NULL,
	"confidence_label" varchar(20) NOT NULL,
	"match_reason" text NOT NULL,
	"status" "match_status" DEFAULT 'potential' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "child_matches" ADD CONSTRAINT "child_matches_found_child_id_found_children_id_fk" FOREIGN KEY ("found_child_id") REFERENCES "public"."found_children"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "child_matches" ADD CONSTRAINT "child_matches_missing_child_id_missing_children_id_fk" FOREIGN KEY ("missing_child_id") REFERENCES "public"."missing_children"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "uniq_match_pair" ON "child_matches" USING btree ("found_child_id","missing_child_id");--> statement-breakpoint
CREATE INDEX "child_matches_found_idx" ON "child_matches" USING btree ("found_child_id");--> statement-breakpoint
CREATE INDEX "child_matches_missing_idx" ON "child_matches" USING btree ("missing_child_id");--> statement-breakpoint
CREATE INDEX "child_matches_score_idx" ON "child_matches" USING btree ("score");