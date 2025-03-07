CREATE UNIQUE INDEX user_email_key ON public."user" USING btree (email);

alter table "public"."user" add constraint "user_email_key" UNIQUE using index "user_email_key";


