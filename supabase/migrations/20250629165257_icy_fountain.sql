/*
  # Create function to get available time slots

  1. New Functions
    - `get_available_time_slots` - Returns available time slots for a teacher on a specific date
  
  2. Purpose
    - This function helps students find available slots in a teacher's schedule
    - It checks the teacher's availability slots against existing confirmed bookings
    - Returns only time slots that are not already booked
*/

CREATE OR REPLACE FUNCTION public.get_available_time_slots(
    p_teacher_id uuid,
    p_target_date date,
    p_slot_duration_minutes integer DEFAULT 60
)
RETURNS TABLE (available_slot timestamptz)
LANGUAGE plpgsql
SECURITY DEFINER -- Important for RLS
SET search_path = public
AS $$
DECLARE
    v_day_of_week integer;
    v_slot_interval interval;
    v_availability_record record;
    v_current_slot timestamptz;
    v_is_booked boolean;
BEGIN
    -- Determine day of week (0 = Sunday, ..., 6 = Saturday)
    v_day_of_week := EXTRACT(DOW FROM p_target_date);
    v_slot_interval := p_slot_duration_minutes * interval '1 minute';

    -- Loop through all availability slots for the teacher on the given day of week
    FOR v_availability_record IN
        SELECT start_time, end_time
        FROM public.availability_slots
        WHERE teacher_id = p_teacher_id AND day_of_week = v_day_of_week
    LOOP
        -- Set the loop start to the beginning of the availability window on the given date
        v_current_slot := p_target_date + v_availability_record.start_time;

        -- Generate slots until we reach the end of the availability window
        WHILE v_current_slot + v_slot_interval <= p_target_date + v_availability_record.end_time LOOP
            -- Check if the generated slot conflicts with an existing confirmed event
            SELECT EXISTS (
                SELECT 1
                FROM public.calendar_events
                WHERE
                    teacher_id = p_teacher_id
                    AND status = 'confirmed'
                    -- Check for time range overlap
                    AND (start_time, end_time) OVERLAPS (v_current_slot, v_current_slot + v_slot_interval)
            ) INTO v_is_booked;

            -- If slot is not booked, add it to the results
            IF NOT v_is_booked THEN
                available_slot := v_current_slot;
                RETURN NEXT;
            END IF;

            -- Move to the next slot
            v_current_slot := v_current_slot + v_slot_interval;
        END LOOP;
    END LOOP;
END;
$$;