/*
  # Calendar Helper Functions

  1. Functions
    - `get_available_slots` - Get available time slots for a teacher on a specific date
    - `check_time_conflict` - Check if a time slot conflicts with existing events
    - `create_recurring_events` - Create recurring calendar events
    - `get_quarter_hour_slots` - Get 15-minute time slots for a day
*/

-- Function to get available 15-minute slots for a teacher on a specific date
CREATE OR REPLACE FUNCTION get_available_slots(
  teacher_user_id uuid,
  target_date date,
  slot_duration_minutes integer DEFAULT 15
)
RETURNS TABLE (
  slot_start time,
  slot_end time,
  is_available boolean
) AS $$
DECLARE
  day_of_week_num integer;
  slot_time time;
  slot_end_time time;
  current_slot_start time := '00:00:00';
  slot_interval interval;
BEGIN
  -- Get day of week (0=Sunday, 1=Monday, etc.)
  day_of_week_num := EXTRACT(DOW FROM target_date);
  
  -- Set slot interval
  slot_interval := (slot_duration_minutes || ' minutes')::interval;
  
  -- Generate 15-minute slots for the entire day
  WHILE current_slot_start < '24:00:00' LOOP
    slot_time := current_slot_start;
    slot_end_time := current_slot_start + slot_interval;
    
    -- Check if this slot is within teacher's availability
    IF EXISTS (
      SELECT 1 FROM availability_slots av
      WHERE av.user_id = teacher_user_id
      AND av.day_of_week = day_of_week_num
      AND av.is_available = true
      AND av.start_time <= slot_time
      AND av.end_time >= slot_end_time
    ) THEN
      -- Check if slot conflicts with existing events
      IF NOT EXISTS (
        SELECT 1 FROM calendar_events ce
        WHERE ce.user_id = teacher_user_id
        AND DATE(ce.start_time) = target_date
        AND ce.status NOT IN ('cancelled')
        AND (
          (TIME(ce.start_time) <= slot_time AND TIME(ce.end_time) > slot_time)
          OR (TIME(ce.start_time) < slot_end_time AND TIME(ce.end_time) >= slot_end_time)
          OR (TIME(ce.start_time) >= slot_time AND TIME(ce.end_time) <= slot_end_time)
        )
      ) THEN
        -- Slot is available
        RETURN QUERY SELECT slot_time, slot_end_time, true;
      ELSE
        -- Slot is occupied
        RETURN QUERY SELECT slot_time, slot_end_time, false;
      END IF;
    ELSE
      -- Slot is outside availability hours
      RETURN QUERY SELECT slot_time, slot_end_time, false;
    END IF;
    
    current_slot_start := current_slot_start + slot_interval;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check for time conflicts
CREATE OR REPLACE FUNCTION check_time_conflict(
  user_uuid uuid,
  event_date date,
  start_time_param time,
  end_time_param time,
  exclude_event_id uuid DEFAULT NULL
)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM calendar_events ce
    WHERE ce.user_id = user_uuid
    AND DATE(ce.start_time) = event_date
    AND ce.status NOT IN ('cancelled')
    AND (exclude_event_id IS NULL OR ce.id != exclude_event_id)
    AND (
      (TIME(ce.start_time) < end_time_param AND TIME(ce.end_time) > start_time_param)
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create recurring events
CREATE OR REPLACE FUNCTION create_recurring_events(
  base_event_id uuid,
  recurrence_count integer DEFAULT 10
)
RETURNS integer AS $$
DECLARE
  base_event calendar_events%ROWTYPE;
  new_start_time timestamptz;
  new_end_time timestamptz;
  week_offset integer;
  created_count integer := 0;
BEGIN
  -- Get the base event
  SELECT * INTO base_event FROM calendar_events WHERE id = base_event_id;
  
  IF NOT FOUND THEN
    RETURN 0;
  END IF;
  
  -- Create weekly recurring events
  FOR week_offset IN 1..recurrence_count LOOP
    new_start_time := base_event.start_time + (week_offset || ' weeks')::interval;
    new_end_time := base_event.end_time + (week_offset || ' weeks')::interval;
    
    -- Check for conflicts before creating
    IF NOT check_time_conflict(
      base_event.user_id,
      DATE(new_start_time),
      TIME(new_start_time),
      TIME(new_end_time)
    ) THEN
      INSERT INTO calendar_events (
        user_id, title, description, start_time, end_time,
        event_type, subject_id, participants, location,
        is_recurring, recurrence_pattern, status
      ) VALUES (
        base_event.user_id, base_event.title, base_event.description,
        new_start_time, new_end_time, base_event.event_type,
        base_event.subject_id, base_event.participants, base_event.location,
        true, jsonb_build_object('base_event_id', base_event_id, 'week_offset', week_offset),
        base_event.status
      );
      
      created_count := created_count + 1;
    END IF;
  END LOOP;
  
  RETURN created_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION get_available_slots TO authenticated;
GRANT EXECUTE ON FUNCTION check_time_conflict TO authenticated;
GRANT EXECUTE ON FUNCTION create_recurring_events TO authenticated;