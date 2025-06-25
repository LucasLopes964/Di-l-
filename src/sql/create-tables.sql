CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS "users" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR,
  "email" VARCHAR,
  "password" VARCHAR,
  "is_admin" BOOLEAN
);

CREATE TABLE IF NOT EXISTS "addresses" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "address" VARCHAR,
  "building_name" VARCHAR,
  "latitude" NUMERIC,
  "longitude" NUMERIC
);

CREATE TABLE IF NOT EXISTS "project_codes"  (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "code" VARCHAR(50) NOT NULL,
  "description" VARCHAR
);


CREATE TABLE IF NOT EXISTS "inspections"  (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "inspection_title" VARCHAR,
  "address_id" UUID,
  "starting_date" TIMESTAMP,
  "due_date" TIMESTAMP,
  "building_type" VARCHAR,
  "description" VARCHAR, 
  "status" VARCHAR,
  "image_url" VARCHAR,
  "project_code_id" UUID
);

CREATE TABLE IF NOT EXISTS "coordinator_assignments" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID,
  "inspection_id" UUID
);

CREATE TABLE IF NOT EXISTS "teams"(
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR,
  "inspection_id" UUID
);

CREATE TABLE IF NOT EXISTS "team_assignments"(
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID,
  "team_id" UUID
);

CREATE TABLE IF NOT EXISTS "environments"  (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR,
  "inspection_id" UUID
);

CREATE TABLE IF NOT EXISTS "records" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR,
  "description" TEXT,
  "environment_id" UUID,
  "user_id" UUID
);

CREATE TABLE IF NOT EXISTS "images"(
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "record_id" UUID,
  "url" VARCHAR
);

CREATE TABLE IF NOT EXISTS "tag_categories"  (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS "tags"  (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR NOT NULL,
  "category_id" UUID
);

CREATE TABLE  IF NOT EXISTS "record_tags"  (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "record_id" UUID,
  "tag_id" UUID
);

CREATE TABLE IF NOT EXISTS "notifications" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID,
  "message" VARCHAR,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "read" BOOLEAN DEFAULT FALSE
);





ALTER TABLE "environments" ADD FOREIGN KEY ("inspection_id") REFERENCES "inspections" ("id") ON DELETE CASCADE;

ALTER TABLE "coordinator_assignments" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE;
ALTER TABLE "coordinator_assignments" ADD FOREIGN KEY ("inspection_id") REFERENCES "inspections" ("id") ON DELETE CASCADE;

ALTER TABLE "teams" ADD FOREIGN KEY ("inspection_id") REFERENCES "inspections" ("id") ON DELETE CASCADE;

ALTER TABLE "team_assignments" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE;
ALTER TABLE "team_assignments" ADD FOREIGN KEY ("team_id") REFERENCES "teams" ("id") ON DELETE CASCADE;

ALTER TABLE "records" ADD FOREIGN KEY ("environment_id") REFERENCES "environments" ("id") ON DELETE CASCADE;
ALTER TABLE "records" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE SET NULL;

ALTER TABLE "images" ADD FOREIGN KEY ("record_id") REFERENCES "records" ("id") ON DELETE CASCADE;

ALTER TABLE "tags" ADD FOREIGN KEY ("category_id") REFERENCES "tag_categories" ("id") ON DELETE SET NULL;

ALTER TABLE "record_tags" ADD FOREIGN KEY ("record_id") REFERENCES "records" ("id") ON DELETE CASCADE;
ALTER TABLE "record_tags" ADD FOREIGN KEY ("tag_id") REFERENCES "tags" ("id") ON DELETE CASCADE;

ALTER TABLE "inspections" ADD FOREIGN KEY ("address_id") REFERENCES "addresses" ("id") ON DELETE SET NULL;

ALTER TABLE "inspections" ADD FOREIGN KEY ("project_code_id") REFERENCES "project_codes" ("id") ON DELETE SET NULL;