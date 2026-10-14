CREATE TYPE "public"."diag_stage" AS ENUM('pre', 'post');--> statement-breakpoint
CREATE TYPE "public"."exercise_type" AS ENUM('classify', 'match', 'order', 'choice', 'feedback');--> statement-breakpoint
CREATE TYPE "public"."level" AS ENUM('easy', 'medium', 'hard');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('student', 'teacher', 'admin');--> statement-breakpoint
CREATE TABLE "certificates" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"number" text NOT NULL,
	"full_name" text NOT NULL,
	"final_score" integer NOT NULL,
	"overall" integer NOT NULL,
	"issued_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "certificates_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "certificates_number_unique" UNIQUE("number")
);
--> statement-breakpoint
CREATE TABLE "diagnostics" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"stage" "diag_stage" NOT NULL,
	"values" jsonb NOT NULL,
	"result" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exercise_attempts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"exercise_id" integer NOT NULL,
	"score" integer NOT NULL,
	"payload" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exercises" (
	"id" serial PRIMARY KEY NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"lesson_id" integer,
	"type" "exercise_type" NOT NULL,
	"title" text NOT NULL,
	"summary" text DEFAULT '' NOT NULL,
	"task" text DEFAULT '' NOT NULL,
	"icon" text DEFAULT 'fa-puzzle-piece' NOT NULL,
	"level" "level" DEFAULT 'medium' NOT NULL,
	"duration" integer DEFAULT 10 NOT NULL,
	"data" jsonb NOT NULL,
	"published" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "glossary" (
	"id" serial PRIMARY KEY NOT NULL,
	"term" text NOT NULL,
	"definition" text NOT NULL,
	CONSTRAINT "glossary_term_unique" UNIQUE("term")
);
--> statement-breakpoint
CREATE TABLE "groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"teacher_id" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "groups_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "lesson_completions" (
	"user_id" integer NOT NULL,
	"lesson_id" integer NOT NULL,
	"completed_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "lesson_completions_user_id_lesson_id_pk" PRIMARY KEY("user_id","lesson_id")
);
--> statement-breakpoint
CREATE TABLE "lessons" (
	"id" serial PRIMARY KEY NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"chapter" text DEFAULT 'I bob' NOT NULL,
	"title" text NOT NULL,
	"summary" text DEFAULT '' NOT NULL,
	"icon" text DEFAULT 'fa-book-open' NOT NULL,
	"duration" integer DEFAULT 20 NOT NULL,
	"goals" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"content" text DEFAULT '' NOT NULL,
	"terms" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"review_questions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"video_url" text,
	"pdf_url" text,
	"published" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "password_resets" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"lesson_id" integer NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"text" text NOT NULL,
	"options" jsonb NOT NULL,
	"correct" integer NOT NULL,
	"explanation" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "simulator_attempts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"simulator_id" integer NOT NULL,
	"score" integer NOT NULL,
	"payload" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "simulators" (
	"id" serial PRIMARY KEY NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"subject" text NOT NULL,
	"grade" text NOT NULL,
	"icon" text DEFAULT 'fa-children' NOT NULL,
	"level" "level" DEFAULT 'medium' NOT NULL,
	"title" text NOT NULL,
	"summary" text DEFAULT '' NOT NULL,
	"task" text NOT NULL,
	"criteria" jsonb NOT NULL,
	"students" jsonb NOT NULL,
	"published" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "test_attempts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"test_key" text NOT NULL,
	"score" integer NOT NULL,
	"correct" integer NOT NULL,
	"total" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tools" (
	"id" serial PRIMARY KEY NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"icon" text DEFAULT 'fa-laptop' NOT NULL,
	"url" text NOT NULL,
	"use" text NOT NULL,
	"tip" text DEFAULT '' NOT NULL,
	"kinds" jsonb DEFAULT '[]'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"full_name" text NOT NULL,
	"role" "role" DEFAULT 'student' NOT NULL,
	"group_id" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_seen_at" timestamp with time zone,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "diagnostics" ADD CONSTRAINT "diagnostics_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercise_attempts" ADD CONSTRAINT "exercise_attempts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercise_attempts" ADD CONSTRAINT "exercise_attempts_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "groups" ADD CONSTRAINT "groups_teacher_id_users_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_completions" ADD CONSTRAINT "lesson_completions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_completions" ADD CONSTRAINT "lesson_completions_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "password_resets" ADD CONSTRAINT "password_resets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "simulator_attempts" ADD CONSTRAINT "simulator_attempts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "simulator_attempts" ADD CONSTRAINT "simulator_attempts_simulator_id_simulators_id_fk" FOREIGN KEY ("simulator_id") REFERENCES "public"."simulators"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_attempts" ADD CONSTRAINT "test_attempts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "diagnostics_user_stage_idx" ON "diagnostics" USING btree ("user_id","stage");--> statement-breakpoint
CREATE INDEX "exercise_attempts_user_idx" ON "exercise_attempts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "questions_lesson_idx" ON "questions" USING btree ("lesson_id");--> statement-breakpoint
CREATE INDEX "sessions_user_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "simulator_attempts_user_idx" ON "simulator_attempts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "test_attempts_user_idx" ON "test_attempts" USING btree ("user_id","test_key");