/*
 * Migracja: Stworzenie funkcji `get_available_time_slots`
 *
 * Ta funkcja PostgreSQL jest kluczowa dla procesu rezerwacji.
 * Oblicza ona dostępne "okienka" na lekcje dla danego nauczyciela i dnia,
 * biorąc pod uwagę jego stały harmonogram i już istniejące rezerwacje.
 *
 * Parametry:
 * - p_teacher_id: UUID nauczyciela
 * - p_target_date: Data, dla której sprawdzamy dostępność
 * - p_slot_duration_minutes: Długość jednego okienka w minutach (domyślnie 60)
 *
 * Zwraca:
 * - Tabelę z kolumną `available_slot`, zawierającą znaczniki czasu
 * początku każdego dostępnego okienka.
 */

CREATE OR REPLACE FUNCTION public.get_available_time_slots(
    p_teacher_id uuid,
    p_target_date date,
    p_slot_duration_minutes integer DEFAULT 60
)
RETURNS TABLE (available_slot timestamptz)
LANGUAGE plpgsql
SECURITY DEFINER -- Ważne dla RLS
SET search_path = public
AS $$
DECLARE
    v_day_of_week integer;
    v_slot_interval interval;
    v_availability_record record;
    v_current_slot timestamptz;
    v_is_booked boolean;
BEGIN
    -- Ustalenie dnia tygodnia (0 = Niedziela, ..., 6 = Sobota)
    v_day_of_week := EXTRACT(DOW FROM p_target_date);
    v_slot_interval := p_slot_duration_minutes * interval '1 minute';

    -- Pętla przez wszystkie stałe okienka dostępności nauczyciela dla danego dnia tygodnia
    FOR v_availability_record IN
        SELECT start_time, end_time
        FROM public.availability_slots
        WHERE teacher_id = p_teacher_id AND day_of_week = v_day_of_week
    LOOP
        -- Ustawienie początku pętli na początek okienka dostępności w danym dniu
        v_current_slot := p_target_date + v_availability_record.start_time;

        -- Generowanie slotów, dopóki nie przekroczymy końca okienka dostępności
        WHILE v_current_slot + v_slot_interval <= p_target_date + v_availability_record.end_time LOOP
            -- Sprawdzenie, czy wygenerowany slot nie koliduje z istniejącym, potwierdzonym wydarzeniem
            SELECT EXISTS (
                SELECT 1
                FROM public.calendar_events
                WHERE
                    teacher_id = p_teacher_id
                    AND status = 'confirmed'
                    -- Sprawdzanie nachodzenia na siebie przedziałów czasowych
                    AND (start_time, end_time) OVERLAPS (v_current_slot, v_current_slot + v_slot_interval)
            ) INTO v_is_booked;

            -- Jeśli slot nie jest zarezerwowany, dodajemy go do wyników
            IF NOT v_is_booked THEN
                available_slot := v_current_slot;
                RETURN NEXT;
            END IF;

            -- Przejście do następnego slotu
            v_current_slot := v_current_slot + v_slot_interval;
        END LOOP;
    END LOOP;
END;
$$;
