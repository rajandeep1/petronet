/*
# Create Admin User

Creates the admin/manager account for the Petro-Canada hiring platform.
This account is used by store managers to log in to the admin dashboard
to manage job postings, store locations, and review applications.

Admin credentials:
- Email: admin@petro-canada.ca
- Password: PetroCanada2026!

Note: Email confirmation is disabled for this project, so the account
is immediately usable upon creation.
*/

DO $$
BEGIN
  -- Check if admin user already exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@petro-canada.ca') THEN
    -- Create the admin user with a fixed password
    -- The auth.users table is managed by Supabase Auth; we insert directly
    -- to provision the admin account since there's no signup UI for admins.
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      email_confirmed_at,
      encrypted_password,
      created_at,
      updated_at,
      raw_app_meta_data,
      raw_user_meta_data,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'admin@petro-canada.ca',
      now(),
      crypt('PetroCanada2026!', gen_salt('bf')),
      now(),
      now(),
      '{}'::jsonb,
      '{}'::jsonb,
      '',
      '',
      '',
      ''
    );
  END IF;
END $$;