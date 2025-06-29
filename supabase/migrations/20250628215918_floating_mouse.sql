/*
 * KROK 2: PRZEDMIOTY I RELACJE
 *
 * Definiuje strukturę przedmiotów nauczania oraz tabele łączące,
 * które modelują relacje między użytkownikami.
 */

-- Tabela przechowująca listę przedmiotów (zarządzana przez admina).
CREATE TABLE public.subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now()
);
COMMENT ON TABLE public.subjects IS 'Lista przedmiotów nauczania dostępnych w systemie.';

-- Tabela łącząca nauczycieli z przedmiotami (relacja wiele-do-wielu).
CREATE TABLE public.teacher_subjects (
  teacher_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject_id uuid NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  PRIMARY KEY (teacher_id, subject_id)
);
COMMENT ON TABLE public.teacher_subjects IS 'Przypisuje nauczycieli do przedmiotów, których mogą uczyć.';

-- Tabela łącząca opiekunów z uczniami (relacja wiele-do-wielu).
CREATE TABLE public.student_guardians (
  student_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  guardian_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  PRIMARY KEY (student_id, guardian_id)
);
COMMENT ON TABLE public.student_guardians IS 'Przypisuje opiekunów do uczniów.';