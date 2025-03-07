INSERT INTO role (id, name, created_at) VALUES
  (gen_random_uuid(), 'Superadmin', NOW()),
  (gen_random_uuid(), 'Admin', NOW()),
  (gen_random_uuid(), 'User', NOW())
ON CONFLICT (id) DO NOTHING;


INSERT INTO "user" (id, email, password, name, surname, role_id, created_at) VALUES
  (gen_random_uuid(), 'admin@admin.com', crypt('liwasabo', gen_salt('bf')), 'Super', 'Admin', 
   (SELECT id FROM role WHERE name = 'Superadmin' LIMIT 1), NOW())
ON CONFLICT (email) DO NOTHING;
