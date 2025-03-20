INSERT INTO role (id, name, created_at) VALUES
  (gen_random_uuid(), 'Superadmin', NOW()),
  (gen_random_uuid(), 'Admin', NOW()),
  (gen_random_uuid(), 'User', NOW())
ON CONFLICT (id) DO NOTHING;


INSERT INTO "user" (id, email, password, name, surname, role_id, created_at) 
VALUES (
  gen_random_uuid(), 
  'admin@admin.com', 
  crypt('liwasabo', gen_salt('bf', 10)),  -- Verschlüsselung direkt in SQL
  'Super', 
  'Admin', 
  (SELECT id FROM role WHERE name = 'Superadmin' LIMIT 1), 
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Erstelle 10 Departments mit zufälligen Namen
INSERT INTO public.department (id, name, created_at)
SELECT
    gen_random_uuid(),
    'Department ' || i,
    NOW() - INTERVAL '1 DAY' * FLOOR(RANDOM() * 7)  -- Erstellungsdatum zufällig in den letzten 7 Tagen
FROM generate_series(1, 10) i;

-- Kommentare für Bewertungen zufällig auswählen (ohne Array-Syntax)
WITH random_comments AS (
    SELECT unnest(ARRAY[
        'Great service!',
        'Not satisfied.',
        'Could be better.',
        'Awesome experience.',
        'I love this department!',
        'Needs improvement.'
    ]) AS comment_text
)
-- Füge 10 Bewertungen pro Department hinzu
INSERT INTO public.rating (id, department_id, rating, comment, created_at)
SELECT
    gen_random_uuid(),
    d.id,
    FLOOR(RANDOM() * 5) + 1,  -- Zufällige Bewertung zwischen 1 und 5
    CASE 
        WHEN RANDOM() > 0.2 THEN (SELECT comment_text FROM random_comments ORDER BY RANDOM() LIMIT 1)
        ELSE NULL 
    END,
    NOW() - INTERVAL '1 DAY' * FLOOR(RANDOM() * 100)  -- Zufällige Erstellungszeit über die letzten 7 Tage
FROM public.department d, generate_series(1, 100);
