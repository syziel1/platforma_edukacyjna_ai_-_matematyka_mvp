/*
  # Security Policies Update

  1. Security Updates
    - Clean up and recreate all RLS policies
    - Ensure proper access control for all tables
    - Fix any existing policy conflicts

  2. Tables Updated
    - profiles: User profile access control
    - subjects: Subject management policies  
    - calendar_events: Event access and management
    - availability_slots: Teacher availability management

  3. Security Features
    - Role-based access control
    - User-specific data access
    - Admin and consultant privileges
*/

-- Funkcja pomocnicza sprawdzająca rolę użytkownika
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS text AS $$
DECLARE
  user_role_val text;
BEGIN
  SELECT role::text INTO user_role_val FROM public.profiles WHERE id = user_id;
  RETURN user_role_val;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 1. Czyszczenie i tworzenie polityk dla tabeli `profiles`
DROP POLICY IF EXISTS "Zalogowani użytkownicy mogą widzieć profile i zarządzać w" ON public.profiles;
DROP POLICY IF EXISTS "Zalogowani użytkownicy mogą widzieć profile i zarządzać własnym" ON public.profiles;
DROP POLICY IF EXISTS "Użytkownicy mogą zarządzać własnym profilem" ON public.profiles;
DROP POLICY IF EXISTS "Zalogowani użytkownicy mogą widzieć profile innych" ON public.profiles;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profile access for authenticated users"
  ON public.profiles FOR ALL
  USING ( (SELECT auth.role()) = 'authenticated' )
  WITH CHECK ( (SELECT auth.uid()) = id );

-- 2. Czyszczenie i tworzenie polityk dla tabeli `subjects`
DROP POLICY IF EXISTS "Użytkownicy i admini mogą zarządzać i widzieć przedmioty" ON public.subjects;
DROP POLICY IF EXISTS "Administratorzy mogą zarządzać przedmiotami" ON public.subjects;
DROP POLICY IF EXISTS "Zalogowani użytkownicy mogą widzieć przedmioty" ON public.subjects;

ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Subject management for authenticated users"
  ON public.subjects FOR ALL
  USING ( (SELECT auth.role()) = 'authenticated' )
  WITH CHECK ( get_user_role((SELECT auth.uid())) = 'admin' );

-- 3. Czyszczenie i tworzenie polityk dla tabeli `calendar_events`
-- Usuwanie wszystkich istniejących polityk
DROP POLICY IF EXISTS "Widok wydarzeń dla uprawnionych" ON public.calendar_events;
DROP POLICY IF EXISTS "Tworzenie wydarzeń dla uprawnionych" ON public.calendar_events;
DROP POLICY IF EXISTS "Aktualizacja wydarzeń dla uprawnionych" ON public.calendar_events;
DROP POLICY IF EXISTS "Usuwanie wydarzeń dla uprawnionych" ON public.calendar_events;
DROP POLICY IF EXISTS "Użytkownicy mogą widzieć odpowiednie wydarzenia" ON public.calendar_events;
DROP POLICY IF EXISTS "Twórcy, nauczyciele i uczestnicy mogą widzieć wydarzenia" ON public.calendar_events;
DROP POLICY IF EXISTS "Konsultanci i admini widzą wszystkie wydarzenia" ON public.calendar_events;
DROP POLICY IF EXISTS "Użytkownicy mogą tworzyć wydarzenia" ON public.calendar_events;
DROP POLICY IF EXISTS "Twórcy mogą tworzyć wydarzenia dla siebie" ON public.calendar_events;
DROP POLICY IF EXISTS "Konsultanci mogą tworzyć wydarzenia dla innych" ON public.calendar_events;
DROP POLICY IF EXISTS "Uprawnieni użytkownicy mogą aktualizować wydarzenia" ON public.calendar_events;
DROP POLICY IF EXISTS "Nauczyciele, konsultanci i admini mogą aktualizować wydarzeni" ON public.calendar_events;
DROP POLICY IF EXISTS "Nauczyciele, konsultanci i admini mogą aktualizować wydarzenia" ON public.calendar_events;
DROP POLICY IF EXISTS "Uprawnieni użytkownicy mogą usuwać wydarzenia" ON public.calendar_events;

ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

-- Nowe polityki z unikalnymi nazwami
CREATE POLICY "Calendar events view access"
  ON public.calendar_events FOR SELECT 
  USING (
    get_user_role((SELECT auth.uid())) IN ('admin', 'consultant') OR
    (SELECT auth.uid()) IN (created_by, teacher_id) OR
    participant_ids ? (SELECT auth.uid())::text
  );

CREATE POLICY "Calendar events insert access"
  ON public.calendar_events FOR INSERT 
  WITH CHECK (
    (SELECT auth.uid()) = created_by OR
    get_user_role((SELECT auth.uid())) = 'consultant'
  );

CREATE POLICY "Calendar events update access"
  ON public.calendar_events FOR UPDATE 
  USING (
    get_user_role((SELECT auth.uid())) IN ('admin', 'consultant') OR
    (SELECT auth.uid()) = teacher_id
  );

CREATE POLICY "Calendar events delete access"
  ON public.calendar_events FOR DELETE 
  USING (
    get_user_role((SELECT auth.uid())) IN ('admin', 'consultant') OR
    (SELECT auth.uid()) = created_by
  );

-- 4. Czyszczenie i tworzenie polityk dla `availability_slots`
DROP POLICY IF EXISTS "Nauczyciele zarządzają swoją dostępnością, inni widzą" ON public.availability_slots;

ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Availability slots management"
  ON public.availability_slots FOR ALL
  USING ( (SELECT auth.role()) = 'authenticated' )
  WITH CHECK ( teacher_id = (SELECT auth.uid()) );

-- 5. Czyszczenie i tworzenie polityk dla pozostałych tabel jeśli istnieją
-- teacher_subjects
DROP POLICY IF EXISTS "Teacher subjects access" ON public.teacher_subjects;
ALTER TABLE public.teacher_subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teacher subjects access"
  ON public.teacher_subjects FOR ALL
  USING ( (SELECT auth.role()) = 'authenticated' );

-- student_guardians  
DROP POLICY IF EXISTS "Student guardians access" ON public.student_guardians;
ALTER TABLE public.student_guardians ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Student guardians access"
  ON public.student_guardians FOR ALL
  USING ( (SELECT auth.role()) = 'authenticated' );

-- event_log (tylko do odczytu dla większości użytkowników)
DROP POLICY IF EXISTS "Event log read access" ON public.event_log;
ALTER TABLE public.event_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Event log read access"
  ON public.event_log FOR SELECT
  USING ( get_user_role((SELECT auth.uid())) IN ('admin', 'consultant') );