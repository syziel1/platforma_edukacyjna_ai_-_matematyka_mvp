/*
  # Calendar Helper Functions with Profiles Integration

  1. Functions
    - `get_available_slots()` - Get available 15-minute slots for a teacher
    - `check_time_conflict()` - Check for scheduling conflicts
    - `create_recurring_events()` - Create recurring calendar events
    - `get_profile_schedule()` - Get complete schedule for a profile
*/

-- Function to get available 15-minute slots for a teacher on a specific date
CREATE OR REPLACE FUNCTION get_available_slots(
  teacher_profile_id uuid,
  target_date date,
  slot_duration_minutes integer DEFAULT 15
)
RETURNS TABLE (
  slot_start timestamptz,
  slot_end timestamptz,
  available_bookings integer
) AS $$
DECLARE
  slot_start_time timestamptz;
  slot_end_time timestamptz;
  day_of_week_num integer;
  availability_record RECORD;
  existing_bookings integer;
BEGIN
  -- Get day of week (0 = Sunday, 1 = Monday, etc.)
  day_of_week_num := EXTRACT(DOW FROM target_date);
  
  -- Loop through all availability slots for this teacher on this day
  FOR availability_record IN 
    SELECT start_time, end_time, max_bookings, slot_type
    FROM availability_slots 
    WHERE profile_id = teacher_profile_id 
    AND day_of_week = day_of_week_num 
    AND is_active = true
    AND slot_type IN ('teaching', 'consultation')
  LOOP
    -- Generate 15-minute slots within this availability window
    slot_start_time := target_date + availability_record.start_time;
    
    WHILE slot_start_time + (slot_duration_minutes || ' minutes')::interval <= target_date + availability_record.end_time LOOP
      slot_end_time := slot_start_time + (slot_duration_minutes || ' minutes')::interval;
      
      -- Count existing bookings for this slot
      SELECT COUNT(*)::integer INTO existing_bookings
      FROM calendar_events
      WHERE profile_id = teacher_profile_id
      AND status IN ('scheduled', 'confirmed')
      AND start_time < slot_end_time
      AND end_time > slot_start_time;
      
      -- Return slot if there's availability
      IF existing_bookings < availability_record.max_bookings THEN
        slot_start := slot_start_time;
        slot_end := slot_end_time;
        available_bookings := availability_record.max_bookings - existing_bookings;
        RETURN NEXT;
      END IF;
      
      slot_start_time := slot_start_time + (slot_duration_minutes || ' minutes')::interval;
    END LOOP;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check for time conflicts
CREATE OR REPLACE FUNCTION check_time_conflict(
  profile_id_param uuid,
  start_time_param timestamptz,
  end_time_param timestamptz,
  exclude_event_id uuid DEFAULT NULL
)
RETURNS boolean AS $$
DECLARE
  conflict_count integer;
BEGIN
  SELECT COUNT(*)::integer INTO conflict_count
  FROM calendar_events
  WHERE profile_id = profile_id_param
  AND status IN ('scheduled', 'confirmed')
  AND start_time < end_time_param
  AND end_time > start_time_param
  AND (exclude_event_id IS NULL OR id != exclude_event_id);
  
  RETURN conflict_count > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create recurring events
CREATE OR REPLACE FUNCTION create_recurring_events(
  base_event_id uuid,
  end_date date
)
RETURNS integer AS $$
DECLARE
  base_event RECORD;
  current_date date;
  new_start_time timestamptz;
  new_end_time timestamptz;
  events_created integer := 0;
  recurrence_days integer[];
  day_offset integer;
BEGIN
  -- Get the base event
  SELECT * INTO base_event
  FROM calendar_events
  WHERE id = base_event_id;
  
  IF NOT FOUND OR NOT base_event.is_recurring THEN
    RETURN 0;
  END IF;
  
  -- Extract recurrence pattern (assuming weekly recurrence with days array)
  recurrence_days := ARRAY(SELECT jsonb_array_elements_text(base_event.recurrence_pattern->'days'))::integer[];
  
  current_date := (base_event.start_time::date) + interval '7 days';
  
  WHILE current_date <= end_date LOOP
    -- Check if current day of week is in recurrence pattern
    IF EXTRACT(DOW FROM current_date)::integer = ANY(recurrence_days) THEN
      new_start_time := current_date + (base_event.start_time::time);
      new_end_time := current_date + (base_event.end_time::time);
      
      -- Check for conflicts
      IF NOT check_time_conflict(base_event.profile_id, new_start_time, new_end_time) THEN
        INSERT INTO calendar_events (
          profile_id, title, description, start_time, end_time,
          event_type, participants, subject_id, is_recurring,
          recurrence_pattern, status, location, notes
        ) VALUES (
          base_event.profile_id, base_event.title, base_event.description,
          new_start_time, new_end_time, base_event.event_type,
          base_event.participants, base_event.subject_id, false,
          NULL, base_event.status, base_event.location, base_event.notes
        );
        
        events_created := events_created + 1;
      END IF;
    END IF;
    
    current_date := current_date + interval '1 day';
  END LOOP;
  
  RETURN events_created;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get complete schedule for a profile
CREATE OR REPLACE FUNCTION get_profile_schedule(
  profile_id_param uuid,
  start_date date,
  end_date date
)
RETURNS TABLE (
  event_id uuid,
  title text,
  description text,
  start_time timestamptz,
  end_time timestamptz,
  event_type text,
  status text,
  subject_name text,
  location text,
  participant_count integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ce.id,
    ce.title,
    ce.description,
    ce.start_time,
    ce.end_time,
    ce.event_type,
    ce.status,
    s.name as subject_name,
    ce.location,
    jsonb_array_length(COALESCE(ce.participants, '[]'::jsonb))::integer as participant_count
  FROM calendar_events ce
  LEFT JOIN subjects s ON s.id = ce.subject_id
  WHERE ce.profile_id = profile_id_param
  AND ce.start_time::date >= start_date
  AND ce.start_time::date <= end_date
  AND ce.status != 'cancelled'
  ORDER BY ce.start_time;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;