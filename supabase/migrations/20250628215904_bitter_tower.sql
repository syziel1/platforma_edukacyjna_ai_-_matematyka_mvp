/*
 * KROK 1: FUNDAMENT - UŻYTKOWNICY, ROLE I PROFILE
 *
 * Tworzy podstawową strukturę do zarządzania użytkownikami i ich danymi.
 * - Typ `user_role` do definiowania ról w systemie.
 * - Główna tabela `profiles` połączona z `auth.users`.
 * - Automatyzacja tworzenia profili i aktualizacji dat.
 */

-- Tworzymy nowy typ (ENUM) dla ról użytkowników dla większego bezpieczeństwa i spójności.
CREATE TYPE public.user_role AS ENUM (
  'admin',
  'consultant',
  'teacher',
  'student',
  'guardian'
);

-- Główna tabela z profilami użytkowników.
-- Jest połączona 1-do-1 z tabelą `auth.users` od Supabase.
CREATE TABLE public.profiles (
  id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text,
  last_name text,
  role user_role NOT NULL,
  -- Opcjonalne pole, w którym nauczyciel określa, czy akceptuje rezerwacje automatycznie.
  auto_accept_bookings boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE public.profiles IS 'Przechowuje publiczne dane profilowe użytkowników, rozszerzając tabelę auth.users.';
COMMENT ON COLUMN public.profiles.role IS 'Rola użytkownika w systemie (nauczyciel, uczeń, etc.).';
COMMENT ON COLUMN public.profiles.auto_accept_bookings IS 'Ustawienie dla nauczyciela, czy rezerwacje są potwierdzane automatycznie.';

-- Funkcja do automatycznej aktualizacji znacznika czasu `updated_at`.
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger, który uruchamia funkcję handle_updated_at() przy każdej aktualizacji profilu.
CREATE TRIGGER on_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Funkcja, która tworzy nowy profil, gdy nowy użytkownik się zarejestruje.
-- Pobiera dane (imię, nazwisko, rola) przekazane podczas rejestracji.
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger, który uruchamia funkcję handle_new_user() po każdej nowej rejestracji w systemie Auth.
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();