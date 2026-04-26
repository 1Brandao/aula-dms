ALTER TABLE "students" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "students" CASCADE;--> statement-breakpoint
ALTER TABLE "teachers" DROP CONSTRAINT "teachers_registration_unique";--> statement-breakpoint
ALTER TABLE "teachers" ADD COLUMN "degree" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "teachers" ADD COLUMN "specialization" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "teachers" ADD COLUMN "admission_date" timestamp with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "teachers" DROP COLUMN "registration";