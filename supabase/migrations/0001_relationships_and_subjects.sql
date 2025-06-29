/*
 * KROK 2: PRZEDMIOTY I RELACJE (Wersja 2)
 *
 * NAPRAWIONO BŁĄD: Włączono RLS dla tabel łączących i dodano polityki.
 */

-- Tabela `subjects` (bez zmian)
CREATE TABLE public.subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now()
);
COMMENT ON TABLE public.subjects IS 'Lista przedmiotów nauczania dostępnych w systemie.';

-- Tabela `teacher_subjects` (z włączonym RLS i polityką)
CREATE TABLE public.teacher_subjects (
  teacher_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject_id uuid NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  PRIMARY KEY (teacher_id, subject_id)
);
COMMENT ON TABLE public.teacher_subjects IS 'Przypisuje nauczycieli do przedmiotów, których mogą uczyć.';

ALTER TABLE public.teacher_subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Zalogowani mogą widzieć przypisania, nauczyciele i admini mogą zarządzać"
  ON public.teacher_subjects FOR ALL
  USING ( (SELECT auth.role()) = 'authenticated' )
  WITH CHECK (
    teacher_id = (SELECT auth.uid()) OR
    get_user_role((SELECT auth.uid())) IN ('admin', 'consultant')
  );

-- Tabela `student_guardians` (z włączonym RLS i polityką)
CREATE TABLE public.student_guardians (
  student_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  guardian_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  PRIMARY KEY (student_id, guardian_id)
);
COMMENT ON TABLE public.student_guardians IS 'Przypisuje opiekunów do uczniów.';

ALTER TABLE public.student_guardians ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Zainteresowani mogą widzieć relacje, opiekunowie i admini zarządzać"
  ON public.student_guardians FOR ALL
  USING (
    (SELECT auth.uid()) IN (student_id, guardian_id) OR
    get_user_role((SELECT auth.uid())) IN ('admin', 'consultant')
  )
  WITH CHECK (
    (SELECT auth.uid()) = guardian_id OR
    get_user_role((SELECT auth.uid())) IN ('admin', 'consultant')
  );