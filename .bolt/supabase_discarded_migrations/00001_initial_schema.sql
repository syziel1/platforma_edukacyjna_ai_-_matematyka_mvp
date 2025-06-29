/*
 * KROK 1: FUNDAMENT - UŻYTKOWNICY, ROLE I PROFILE (Wersja 2)
 *
 * Dodano SET search_path do funkcji, aby zapewnić bezpieczeństwo.
 */

-- Typ `user_role` (bez zmian)
CREATE TYPE public.user_role AS ENUM (
  'admin',
  'consultant',
  'teacher',
  'student',
  'guardian'
);

-- Tabela `profiles` (bez zmian)
CREATE TABLE public.profiles (
  id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text,
  last_name text,
  role user_role NOT NULL,
  auto_accept_bookings boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE public.profiles IS 'Przechowuje publiczne dane profilowe użytkowników, rozszerzając tabelę auth.users.';

-- Funkcja do aktualizacji `updated_at` (z poprawką bezpieczeństwa)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger `on_profiles_updated` (bez zmian)
CREATE TRIGGER on_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Funkcja do tworzenia nowego profilu (z poprawką bezpieczeństwa)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    (NEW.raw_user_meta_data->>'role')::user_role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger `on_auth_user_created` (bez zmian)
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();