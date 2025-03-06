create table "public"."department" (
    "id" uuid not null default gen_random_uuid(),
    "name" text,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."department" enable row level security;

create table "public"."rating" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "department_id" uuid default gen_random_uuid(),
    "comment" text,
    "rating" real
);


alter table "public"."rating" enable row level security;

create table "public"."stress" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "stress" real,
    "department_id" uuid default gen_random_uuid()
);


alter table "public"."stress" enable row level security;

CREATE UNIQUE INDEX department_pkey ON public.department USING btree (id);

CREATE UNIQUE INDEX rating_pkey ON public.rating USING btree (id);

CREATE UNIQUE INDEX stress_pkey ON public.stress USING btree (id);

alter table "public"."department" add constraint "department_pkey" PRIMARY KEY using index "department_pkey";

alter table "public"."rating" add constraint "rating_pkey" PRIMARY KEY using index "rating_pkey";

alter table "public"."stress" add constraint "stress_pkey" PRIMARY KEY using index "stress_pkey";

alter table "public"."rating" add constraint "rating_department_id_fkey" FOREIGN KEY (department_id) REFERENCES department(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."rating" validate constraint "rating_department_id_fkey";

alter table "public"."stress" add constraint "stress_department_id_fkey" FOREIGN KEY (department_id) REFERENCES department(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."stress" validate constraint "stress_department_id_fkey";

grant delete on table "public"."department" to "anon";

grant insert on table "public"."department" to "anon";

grant references on table "public"."department" to "anon";

grant select on table "public"."department" to "anon";

grant trigger on table "public"."department" to "anon";

grant truncate on table "public"."department" to "anon";

grant update on table "public"."department" to "anon";

grant delete on table "public"."department" to "authenticated";

grant insert on table "public"."department" to "authenticated";

grant references on table "public"."department" to "authenticated";

grant select on table "public"."department" to "authenticated";

grant trigger on table "public"."department" to "authenticated";

grant truncate on table "public"."department" to "authenticated";

grant update on table "public"."department" to "authenticated";

grant delete on table "public"."department" to "service_role";

grant insert on table "public"."department" to "service_role";

grant references on table "public"."department" to "service_role";

grant select on table "public"."department" to "service_role";

grant trigger on table "public"."department" to "service_role";

grant truncate on table "public"."department" to "service_role";

grant update on table "public"."department" to "service_role";

grant delete on table "public"."rating" to "anon";

grant insert on table "public"."rating" to "anon";

grant references on table "public"."rating" to "anon";

grant select on table "public"."rating" to "anon";

grant trigger on table "public"."rating" to "anon";

grant truncate on table "public"."rating" to "anon";

grant update on table "public"."rating" to "anon";

grant delete on table "public"."rating" to "authenticated";

grant insert on table "public"."rating" to "authenticated";

grant references on table "public"."rating" to "authenticated";

grant select on table "public"."rating" to "authenticated";

grant trigger on table "public"."rating" to "authenticated";

grant truncate on table "public"."rating" to "authenticated";

grant update on table "public"."rating" to "authenticated";

grant delete on table "public"."rating" to "service_role";

grant insert on table "public"."rating" to "service_role";

grant references on table "public"."rating" to "service_role";

grant select on table "public"."rating" to "service_role";

grant trigger on table "public"."rating" to "service_role";

grant truncate on table "public"."rating" to "service_role";

grant update on table "public"."rating" to "service_role";

grant delete on table "public"."stress" to "anon";

grant insert on table "public"."stress" to "anon";

grant references on table "public"."stress" to "anon";

grant select on table "public"."stress" to "anon";

grant trigger on table "public"."stress" to "anon";

grant truncate on table "public"."stress" to "anon";

grant update on table "public"."stress" to "anon";

grant delete on table "public"."stress" to "authenticated";

grant insert on table "public"."stress" to "authenticated";

grant references on table "public"."stress" to "authenticated";

grant select on table "public"."stress" to "authenticated";

grant trigger on table "public"."stress" to "authenticated";

grant truncate on table "public"."stress" to "authenticated";

grant update on table "public"."stress" to "authenticated";

grant delete on table "public"."stress" to "service_role";

grant insert on table "public"."stress" to "service_role";

grant references on table "public"."stress" to "service_role";

grant select on table "public"."stress" to "service_role";

grant trigger on table "public"."stress" to "service_role";

grant truncate on table "public"."stress" to "service_role";

grant update on table "public"."stress" to "service_role";


