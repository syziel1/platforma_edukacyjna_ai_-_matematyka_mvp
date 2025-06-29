/*
 * KROK 5: POLITYKI BEZPIECZEŃSTWA (ROW LEVEL SECURITY)
 *
 * Ten plik definiuje wszystkie reguły dostępu do danych.
 * Zapewnia, że użytkownicy widzą i modyfikują tylko te dane,
 * do których mają uprawnienia.
 */

-- Funkcja pomocnicza sprawdzająca rolę użytkownika.
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS text AS $$
DECLARE
  user_role_val text;
BEGIN
  SELECT role::text INTO user_role_val FROM public.profiles WHERE id = user_id;
  RETURN user_role_val;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 1. Polityki dla tabeli `profiles`
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Użytkownicy mogą zarządzać własnym profilem"
  ON public.profiles FOR ALL USING (auth.uid() = id);

CREATE POLICY "Zalogowani użytkownicy mogą widzieć profile innych"
  ON public.profiles FOR SELECT USING (auth.role() = 'authenticated');


-- 2. Polityki dla tabeli `subjects`
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Administratorzy mogą zarządzać przedmiotami"
  ON public.subjects FOR ALL USING (get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Zalogowani użytkownicy mogą widzieć przedmioty"
  ON public.subjects FOR SELECT USING (auth.role() = 'authenticated');


-- 3. Polityki dla tabeli `calendar_events`
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Twórcy, nauczyciele i uczestnicy mogą widzieć wydarzenia"
  ON public.calendar_events FOR SELECT USING (
    -- Twórca wydarzenia
    auth.uid() = created_by OR
    -- Nauczyciel prowadzący
    auth.uid() = teacher_id OR
    -- Uczestnik (sprawdzamy, czy ID użytkownika jest w tablicy participant_ids)
    participant_ids ? auth.uid()::text
  );

CREATE POLICY "Konsultanci i admini widzą wszystkie wydarzenia"
  ON public.calendar_events FOR SELECT USING (get_user_role(auth.uid()) IN ('admin', 'consultant'));

CREATE POLICY "Twórcy mogą tworzyć wydarzenia dla siebie"
  ON public.calendar_events FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Konsultanci mogą tworzyć wydarzenia dla innych"
  ON public.calendar_events FOR INSERT WITH CHECK (get_user_role(auth.uid()) = 'consultant');

CREATE POLICY "Nauczyciele, konsultanci i admini mogą aktualizować wydarzenia"
  ON public.calendar_events FOR UPDATE USING (
    get_user_role(auth.uid()) IN ('admin', 'consultant') OR auth.uid() = teacher_id
  );

-- Pozostałe polityki (dla `availability_slots`, `student_guardians`, etc.) należy dodać w analogiczny sposób,
-- dostosowując je do konkretnych wymagań (np. "Nauczyciel zarządza swoją dostępnością").