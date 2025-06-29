/*
 * KROK 5: POLITYKI BEZPIECZEŃSTWA (ROW LEVEL SECURITY) - WERSJA ZOPTYMALIZOWANA
 *
 * Poprawiona wersja pliku z politykami RLS, która rozwiązuje ostrzeżenia
 * dotyczące wydajności (`auth_rls_initplan` i `multiple_permissive_policies`).
 * Zmiany polegają na opakowaniu funkcji `auth` w `(SELECT ...)` oraz
 * na połączeniu wielu reguł w jedną za pomocą operatora `OR`.
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


-- 1. Polityki dla tabeli `profiles` (zoptymalizowane)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- POPRAWKA: Połączono dwie polityki SELECT w jedną i zoptymalizowano wywołania `auth.uid()`.
CREATE POLICY "Zalogowani użytkownicy mogą widzieć profile i zarządzać własnym"
  ON public.profiles FOR ALL
  USING (
    (SELECT auth.role()) = 'authenticated'
  )
  WITH CHECK (
    (SELECT auth.uid()) = id
  );


-- 2. Polityki dla tabeli `subjects` (zoptymalizowane)
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

-- POPRAWKA: Połączono dwie polityki SELECT i zoptymalizowano wywołania funkcji.
CREATE POLICY "Użytkownicy i admini mogą zarządzać i widzieć przedmioty"
  ON public.subjects FOR ALL
  USING (
    (SELECT auth.role()) = 'authenticated'
  )
  WITH CHECK (
    get_user_role((SELECT auth.uid())) = 'admin'
  );


-- 3. Polityki dla tabeli `calendar_events` (zoptymalizowane)
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

-- POPRAWKA: Połączono dwie polityki SELECT w jedną, spójną regułę.
CREATE POLICY "Użytkownicy mogą widzieć odpowiednie wydarzenia"
  ON public.calendar_events FOR SELECT
  USING (
    -- Admini i konsultanci widzą wszystko LUB...
    get_user_role((SELECT auth.uid())) IN ('admin', 'consultant') OR
    -- ...twórca wydarzenia, nauczyciel prowadzący lub uczestnik widzi swoje.
    (SELECT auth.uid()) = created_by OR
    (SELECT auth.uid()) = teacher_id OR
    participant_ids ? (SELECT auth.uid())::text
  );

-- POPRAWKA: Połączono dwie polityki INSERT w jedną, spójną regułę.
CREATE POLICY "Użytkownicy mogą tworzyć wydarzenia"
  ON public.calendar_events FOR INSERT
  WITH CHECK (
    -- Twórca tworzy wydarzenie dla siebie LUB...
    (SELECT auth.uid()) = created_by OR
    -- ...konsultant tworzy wydarzenie dla innych.
    get_user_role((SELECT auth.uid())) = 'consultant'
  );

-- POPRAWKA: Zmieniono nazwę i zoptymalizowano wywołanie funkcji.
CREATE POLICY "Uprawnieni użytkownicy mogą aktualizować wydarzenia"
  ON public.calendar_events FOR UPDATE
  USING (
    get_user_role((SELECT auth.uid())) IN ('admin', 'consultant') OR
    (SELECT auth.uid()) = teacher_id
  );

-- Należy dodać politykę dla operacji DELETE, jeśli jest wymagana, np.:
CREATE POLICY "Uprawnieni użytkownicy mogą usuwać wydarzenia"
    ON public.calendar_events FOR DELETE
    USING (
        get_user_role((SELECT auth.uid())) IN ('admin', 'consultant') OR
        (SELECT auth.uid()) = created_by
    );


-- Upewnij się, że inne tabele również mają zdefiniowane i zoptymalizowane polityki.
-- Przykład dla `availability_slots`:
ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Nauczyciele zarządzają swoją dostępnością, inni widzą"
    ON public.availability_slots FOR ALL
    USING ( (SELECT auth.role()) = 'authenticated' )
    WITH CHECK ( teacher_id = (SELECT auth.uid()) );