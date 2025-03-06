create table "public"."role" (
    "id" uuid not null default gen_random_uuid(),
    "name" text,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."role" enable row level security;

create table "public"."session" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid default gen_random_uuid(),
    "token" text,
    "expiration_date" timestamp with time zone,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."session" enable row level security;

alter table "public"."user" add column "role_id" uuid default gen_random_uuid();

CREATE UNIQUE INDEX role_pkey ON public.role USING btree (id);

CREATE UNIQUE INDEX session_pkey ON public.session USING btree (id);

alter table "public"."role" add constraint "role_pkey" PRIMARY KEY using index "role_pkey";

alter table "public"."session" add constraint "session_pkey" PRIMARY KEY using index "session_pkey";

alter table "public"."session" add constraint "session_user_id_fkey" FOREIGN KEY (user_id) REFERENCES "user"(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."session" validate constraint "session_user_id_fkey";

alter table "public"."user" add constraint "user_role_id_fkey" FOREIGN KEY (role_id) REFERENCES role(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."user" validate constraint "user_role_id_fkey";

grant delete on table "public"."role" to "anon";

grant insert on table "public"."role" to "anon";

grant references on table "public"."role" to "anon";

grant select on table "public"."role" to "anon";

grant trigger on table "public"."role" to "anon";

grant truncate on table "public"."role" to "anon";

grant update on table "public"."role" to "anon";

grant delete on table "public"."role" to "authenticated";

grant insert on table "public"."role" to "authenticated";

grant references on table "public"."role" to "authenticated";

grant select on table "public"."role" to "authenticated";

grant trigger on table "public"."role" to "authenticated";

grant truncate on table "public"."role" to "authenticated";

grant update on table "public"."role" to "authenticated";

grant delete on table "public"."role" to "service_role";

grant insert on table "public"."role" to "service_role";

grant references on table "public"."role" to "service_role";

grant select on table "public"."role" to "service_role";

grant trigger on table "public"."role" to "service_role";

grant truncate on table "public"."role" to "service_role";

grant update on table "public"."role" to "service_role";

grant delete on table "public"."session" to "anon";

grant insert on table "public"."session" to "anon";

grant references on table "public"."session" to "anon";

grant select on table "public"."session" to "anon";

grant trigger on table "public"."session" to "anon";

grant truncate on table "public"."session" to "anon";

grant update on table "public"."session" to "anon";

grant delete on table "public"."session" to "authenticated";

grant insert on table "public"."session" to "authenticated";

grant references on table "public"."session" to "authenticated";

grant select on table "public"."session" to "authenticated";

grant trigger on table "public"."session" to "authenticated";

grant truncate on table "public"."session" to "authenticated";

grant update on table "public"."session" to "authenticated";

grant delete on table "public"."session" to "service_role";

grant insert on table "public"."session" to "service_role";

grant references on table "public"."session" to "service_role";

grant select on table "public"."session" to "service_role";

grant trigger on table "public"."session" to "service_role";

grant truncate on table "public"."session" to "service_role";

grant update on table "public"."session" to "service_role";


