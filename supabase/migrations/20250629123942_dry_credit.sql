/*
  # Fix Users Table Reference

  1. Changes
    - Create a view that maps auth.users to public.users for backward compatibility
    - Ensure profiles table exists and has proper references

  This migration addresses the "relation users does not exist" error by creating
  a view that maps the auth.users table to public.users, which some queries might
  be expecting.
*/

-- Create a view that maps auth.users to public.users for backward compatibility
CREATE OR REPLACE VIEW public.users AS
SELECT 
  id,
  email,
  created_at
FROM auth.users;

-- Ensure we have proper RLS policies for the view
ALTER VIEW public.users OWNER TO postgres;
GRANT SELECT ON public.users TO authenticated;
GRANT SELECT ON public.users TO service_role;

-- Make sure profiles table exists with proper references
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
    CREATE TABLE public.profiles (
      id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      first_name text,
      last_name text,
      role text,
      phone_number text,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );

    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Users can view their own profile"
      ON public.profiles
      FOR SELECT
      USING (auth.uid() = id);
      
    CREATE POLICY "Users can update their own profile"
      ON public.profiles
      FOR UPDATE
      USING (auth.uid() = id);
  END IF;
END $$;