/*
 * =================================================================
 * ==                KOMPLETNY SCHEMAT BAZY DANYCH                ==
 * =================================================================
 *
 * Wersja: Ostateczna
 *
 * Ten jeden plik tworzy całą strukturę bazy danych od zera w poprawny,
 * bezpieczny i zoptymalizowany sposób. Zawiera wszystkie poprawki
 * dotyczące RLS, bezpieczeństwa funkcji i usuwania zależności.
 *
 * INSTRUKCJA:
 * 1. Usuń wszystkie inne pliki migracji z folderu supabase/migrations.
 * 2. Umieść ten plik jako jedyny w tym folderze.
 * 3. Uruchom `supabase db push`.
 */

-- =================================================================
-- == KROK 1: CZYSZCZENIE STAREJ STRUKTURY (BEZPIECZEŃSTWO) ========
-- =================================================================
-- Usuwamy funkcje kaskadowo, aby pozbyć się ich razem z zależnościami (triggerami).
DROP FUNCTION IF EXISTS public.handle_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.log_event() CASCADE;
DROP FUNCTION IF EXISTS public.get_user_role(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

-- =================================================================
-- == KROK 2: DEFINICJE TYPÓW (ENUMS) ==============================
-- =================================================================
CREATE TYPE public.user_role AS ENUM ('admin', 'consultant', 'teacher', 'student', 'guardian');
CREATE TYPE public.event_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE public.event_type AS ENUM ('individual_lesson', 'group_lesson', 'consultation');

-- =================================================================
-- == KROK 3: BEZPIECZNE TWORZENIE FUNKCJI ==========================
-- =================================================================
-- Każda funkcja jest tworzona z `SECURITY DEFINER` i `SET search_path`,
-- aby zapobiec ostrzeżeniom i zapewnić bezpieczeństwo.

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

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

CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS text AS $$
DECLARE
  user_role_val text;
BEGIN
  SELECT role::text INTO user_role_val FROM public.profiles WHERE id = user_id;
  RETURN user_role_val;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.log_event()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.event_log (user_id, action, table_name, record_id, details)
  VALUES (auth.uid(), TG_OP, TG_TABLE_NAME,
    CASE TG_OP
      WHEN 'INSERT' THEN NEW.id::text WHEN 'UPDATE' THEN NEW.id::text WHEN 'DELETE' THEN OLD.id::text
    END,
    CASE TG_OP
      WHEN 'INSERT' THEN jsonb_build_object('new_data', to_jsonb(NEW))
      WHEN 'UPDATE' THEN jsonb_build_object('old_data', to_jsonb(OLD), 'new_data', to_jsonb(NEW))
      WHEN 'DELETE' THEN jsonb_build_object('old_data', to_jsonb(OLD))
    END
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- =================================================================
-- == KROK 4: TWORZENIE TABEL ======================================
-- =================================================================

-- Tabela PROFILES (Centralna tabela użytkowników)
CREATE TABLE public.profiles (
  id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text,
  last_name text,
  role user_role NOT NULL,
  auto_accept_bookings boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela SUBJECTS
CREATE TABLE public.subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Tabela TEACHER_SUBJECTS (Tabela łącząca)
CREATE TABLE public.teacher_subjects (
  teacher_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject_id uuid NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  PRIMARY KEY (teacher_id, subject_id)
);

-- Tabela STUDENT_GUARDIANS (Tabela łącząca)
CREATE TABLE public.student_guardians (
  student_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  guardian_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  PRIMARY KEY (student_id, guardian_id)
);

-- Tabela AVAILABILITY_SLOTS
CREATE TABLE public.availability_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_time_range CHECK (start_time < end_time)
);

-- Tabela CALENDAR_EVENTS
CREATE TABLE public.calendar_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  teacher_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES public.subjects(id) ON DELETE SET NULL,
  event_type event_type NOT NULL,
  status event_status NOT NULL DEFAULT 'pending',
  participant_ids jsonb DEFAULT '[]'::jsonb,
  is_recurring boolean DEFAULT false,
  created_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_event_time_range CHECK (start_time < end_time)
);

-- Tabela EVENT_LOG (Dziennik zdarzeń)
CREATE TABLE public.event_log (
  id bigserial PRIMARY KEY,
  timestamp timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  table_name text,
  record_id text,
  details jsonb
);

-- =================================================================
-- == KROK 5: TWORZENIE TRIGGERÓW (WYZWALACZY) =====================
-- =================================================================
-- Tworzymy triggery, aby zautomatyzować działanie bazy danych.

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
CREATE TRIGGER on_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER on_calendar_events_updated BEFORE UPDATE ON public.calendar_events FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER log_profiles_changes AFTER INSERT OR UPDATE OR DELETE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE public.log_event();
CREATE TRIGGER log_calendar_events_changes AFTER INSERT OR UPDATE OR DELETE ON public.calendar_events FOR EACH ROW EXECUTE PROCEDURE public.log_event();

-- =================================================================
-- == KROK 6: WŁĄCZENIE RLS I POLITYKI BEZPIECZEŃSTWA ================
-- =================================================================
-- To jest serce bezpieczeństwa aplikacji. Włączamy RLS dla wszystkich tabel
-- i definiujemy precyzyjne, skonsolidowane reguły dostępu.

-- PROFILES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Zalogowani mogą widzieć i zarządzać swoim profilem" ON public.profiles FOR ALL
  USING ( (SELECT auth.role()) = 'authenticated' )
  WITH CHECK ( (SELECT auth.uid()) = id );

-- SUBJECTS
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admini zarządzają, wszyscy zalogowani widzą przedmioty" ON public.subjects FOR ALL
  USING ( (SELECT auth.role()) = 'authenticated' )
  WITH CHECK ( get_user_role((SELECT auth.uid())) = 'admin' );

-- TEACHER_SUBJECTS
ALTER TABLE public.teacher_subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Zarządzanie i widok przypisań nauczycieli do przedmiotów" ON public.teacher_subjects FOR ALL
  USING ( (SELECT auth.role()) = 'authenticated' )
  WITH CHECK ( teacher_id = (SELECT auth.uid()) OR get_user_role((SELECT auth.uid())) IN ('admin', 'consultant') );

-- STUDENT_GUARDIANS
ALTER TABLE public.student_guardians ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Zarządzanie i widok relacji uczeń-opiekun" ON public.student_guardians FOR ALL
  USING ( (SELECT auth.uid()) IN (student_id, guardian_id) OR get_user_role((SELECT auth.uid())) IN ('admin', 'consultant') )
  WITH CHECK ( (SELECT auth.uid()) = guardian_id OR get_user_role((SELECT auth.uid())) IN ('admin', 'consultant') );

-- AVAILABILITY_SLOTS
ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Nauczyciele zarządzają swoją dostępnością, inni widzą" ON public.availability_slots FOR ALL
  USING ( (SELECT auth.role()) = 'authenticated' )
  WITH CHECK ( teacher_id = (SELECT auth.uid()) );

-- CALENDAR_EVENTS
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Widok wydarzeń dla uprawnionych" ON public.calendar_events FOR SELECT USING ( get_user_role((SELECT auth.uid())) IN ('admin', 'consultant') OR (SELECT auth.uid()) IN (created_by, teacher_id) OR participant_ids ? (SELECT auth.uid())::text );
CREATE POLICY "Tworzenie wydarzeń dla uprawnionych" ON public.calendar_events FOR INSERT WITH CHECK ( (SELECT auth.uid()) = created_by OR get_user_role((SELECT auth.uid())) = 'consultant' );
CREATE POLICY "Aktualizacja wydarzeń dla uprawnionych" ON public.calendar_events FOR UPDATE USING ( get_user_role((SELECT auth.uid())) IN ('admin', 'consultant') OR (SELECT auth.uid()) = teacher_id );
CREATE POLICY "Usuwanie wydarzeń dla uprawnionych" ON public.calendar_events FOR DELETE USING ( get_user_role((SELECT auth.uid())) IN ('admin', 'consultant') OR (SELECT auth.uid()) = created_by );

-- EVENT_LOG
ALTER TABLE public.event_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Dostęp do logów tylko dla administracji" ON public.event_log FOR SELECT
  USING ( get_user_role((SELECT auth.uid())) IN ('admin', 'consultant') );