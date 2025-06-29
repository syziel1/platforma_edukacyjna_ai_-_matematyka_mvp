/*
 * KROK 3: KALENDARZ, DOSTĘPNOŚĆ I WYDARZENIA
 *
 * Tworzy tabele niezbędne do zarządzania harmonogramem nauczycieli
 * oraz rezerwacjami lekcji.
 */

-- Tabela dostępności nauczycieli.
CREATE TABLE public.availability_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Niedziela, 1=Poniedziałek
  start_time time NOT NULL,
  end_time time NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_time_range CHECK (start_time < end_time)
);
COMMENT ON TABLE public.availability_slots IS 'Definiuje stałe "okienka" dostępności dla nauczycieli w tygodniu.';

-- Typ (ENUM) dla statusu wydarzeń w kalendarzu.
CREATE TYPE public.event_status AS ENUM (
  'pending',    -- Oczekuje na akceptację nauczyciela/konsultanta
  'confirmed',  -- Potwierdzone i zarezerwowane
  'cancelled',  -- Anulowane przez użytkownika lub system
  'completed'   -- Zakończone
);

-- Typ (ENUM) dla typu wydarzenia.
CREATE TYPE public.event_type AS ENUM (
  'individual_lesson',
  'group_lesson',
  'consultation'
);

-- Główna tabela wydarzeń w kalendarzu.
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
  -- Pole JSONB przechowujące listę ID uczestników (uczniów).
  participant_ids jsonb DEFAULT '[]'::jsonb,
  is_recurring boolean DEFAULT false,
  created_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_event_time_range CHECK (start_time < end_time)
);
COMMENT ON TABLE public.calendar_events IS 'Centralna tabela dla wszystkich wydarzeń: lekcji, konsultacji itp.';
COMMENT ON COLUMN public.calendar_events.participant_ids IS 'Tablica UUID uczniów biorących udział w wydarzeniu.';
COMMENT ON COLUMN public.calendar_events.created_by IS 'ID użytkownika (uczeń, opiekun, konsultant), który utworzył wydarzenie.';

-- Trigger do aktualizacji `updated_at` w tabeli wydarzeń.
CREATE TRIGGER on_calendar_events_updated
  BEFORE UPDATE ON public.calendar_events
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();