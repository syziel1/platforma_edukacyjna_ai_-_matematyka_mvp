/*
 * KROK 5: POLITYKI BEZPIECZEŃSTWA (ROW LEVEL SECURITY) - WERSJA FINALNA
 *
 * Wersja idempotentna, która najpierw usuwa wszystkie istniejące (stare i błędne)
 * polityki dla danych tabel, a następnie tworzy nowe, zoptymalizowane reguły.
 * To rozwiązuje problemy z `multiple_permissive_policies` i `auth_rls_initplan`.
 */

-- Funkcja pomocnicza sprawdzająca rolę użytkownika (bez zmian).
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS text AS $$
DECLARE
  user_role_val text;
BEGIN
  SELECT role::text INTO user_role_val FROM public.profiles WHERE id = user_id;
  RETURN user_role_val;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 1. Czyszczenie i tworzenie polityk dla tabeli `profiles`
DROP POLICY IF EXISTS "Zalogowani użytkownicy mogą widzieć profile i zarządzać własnym" ON public.profiles;
DROP POLICY IF EXISTS "Użytkownicy mogą zarządzać własnym profilem" ON public.profiles;
DROP POLICY IF EXISTS "Zalogowani użytkownicy mogą widzieć profile innych" ON public.profiles;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Zalogowani użytkownicy mogą widzieć profile i zarządzać własnym"
  ON public.profiles FOR ALL
  USING ( (SELECT auth.role()) = 'authenticated' )
  WITH CHECK ( (SELECT auth.uid()) = id );


-- 2. Czyszczenie i tworzenie polityk dla tabeli `subjects`
DROP POLICY IF EXISTS "Użytkownicy i admini mogą zarządzać i widzieć przedmioty" ON public.subjects;
DROP POLICY IF EXISTS "Administratorzy mogą zarządzać przedmiotami" ON public.subjects;
DROP POLICY IF EXISTS "Zalogowani użytkownicy mogą widzieć przedmioty" ON public.subjects;

ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Użytkownicy i admini mogą zarządzać i widzieć przedmioty"
  ON public.subjects FOR ALL
  USING ( (SELECT auth.role()) = 'authenticated' )
  WITH CHECK ( get_user_role((SELECT auth.uid())) = 'admin' );


-- 3. Czyszczenie i tworzenie polityk dla tabeli `calendar_events`
-- Czyszczenie starych reguł
DROP POLICY IF EXISTS "Użytkownicy mogą widzieć odpowiednie wydarzenia" ON public.calendar_events;
DROP POLICY IF EXISTS "Twórcy, nauczyciele i uczestnicy mogą widzieć wydarzenia" ON public.calendar_events;
DROP POLICY IF EXISTS "Konsultanci i admini widzą wszystkie wydarzenia" ON public.calendar_events;
DROP POLICY IF EXISTS "Użytkownicy mogą tworzyć wydarzenia" ON public.calendar_events;
DROP POLICY IF EXISTS "Twórcy mogą tworzyć wydarzenia dla siebie" ON public.calendar_events;
DROP POLICY IF EXISTS "Konsultanci mogą tworzyć wydarzenia dla innych" ON public.calendar_events;
DROP POLICY IF EXISTS "Uprawnieni użytkownicy mogą aktualizować wydarzenia" ON public.calendar_events;
DROP POLICY IF EXISTS "Nauczyciele, konsultanci i admini mogą aktualizować wydarzeni" ON public.calendar_events; -- (poprawiono literówkę)
DROP POLICY IF EXISTS "Nauczyciele, konsultanci i admini mogą aktualizować wydarzenia" ON public.calendar_events;
DROP POLICY IF EXISTS "Uprawnieni użytkownicy mogą usuwać wydarzenia" ON public.calendar_events;

ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

-- Nowe, skonsolidowane reguły
CREATE POLICY "Widok wydarzeń dla uprawnionych" ON public.calendar_events FOR SELECT USING (
  get_user_role((SELECT auth.uid())) IN ('admin', 'consultant') OR
  (SELECT auth.uid()) IN (created_by, teacher_id) OR
  participant_ids ? (SELECT auth.uid())::text
);
CREATE POLICY "Tworzenie wydarzeń dla uprawnionych" ON public.calendar_events FOR INSERT WITH CHECK (
  (SELECT auth.uid()) = created_by OR
  get_user_role((SELECT auth.uid())) = 'consultant'
);
CREATE POLICY "Aktualizacja wydarzeń dla uprawnionych" ON public.calendar_events FOR UPDATE USING (
  get_user_role((SELECT auth.uid())) IN ('admin', 'consultant') OR
  (SELECT auth.uid()) = teacher_id
);
CREATE POLICY "Usuwanie wydarzeń dla uprawnionych" ON public.calendar_events FOR DELETE USING (
  get_user_role((SELECT auth.uid())) IN ('admin', 'consultant') OR
  (SELECT auth.uid()) = created_by
);

-- 4. Czyszczenie i tworzenie polityk dla `availability_slots`
DROP POLICY IF EXISTS "Nauczyciele zarządzają swoją dostępnością, inni widzą" ON public.availability_slots;
ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Nauczyciele zarządzają swoją dostępnością, inni widzą"
    ON public.availability_slots FOR ALL
    USING ( (SELECT auth.role()) = 'authenticated' )
    WITH CHECK ( teacher_id = (SELECT auth.uid()) );