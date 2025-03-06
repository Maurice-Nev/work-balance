alter table "public"."stress" add column "user_id" uuid default gen_random_uuid();

alter table "public"."stress" add constraint "stress_user_id_fkey" FOREIGN KEY (user_id) REFERENCES "user"(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."stress" validate constraint "stress_user_id_fkey";


