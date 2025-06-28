/*
  # Sample Calendar and Availability Data

  This migration adds sample availability slots and calendar events
  to demonstrate the calendar system functionality.
*/

-- Sample availability slots for teachers (Monday to Friday, 8:00-16:00)
-- Note: This assumes we have teachers in the system already

-- Teacher availability - Monday to Friday, 8:00-12:00 and 13:00-17:00
DO $$
DECLARE
  teacher_record RECORD;
  day_num integer;
BEGIN
  -- For each teacher, create availability slots
  FOR teacher_record IN 
    SELECT u.id as user_id 
    FROM users u 
    WHERE u.user_type = 'teacher' 
    LIMIT 3 -- Limit to first 3 teachers for demo
  LOOP
    -- Monday to Friday (1-5)
    FOR day_num IN 1..5 LOOP
      -- Morning session: 8:00-12:00
      INSERT INTO availability_slots (
        user_id, day_of_week, start_time, end_time,
        is_available, slot_type, max_bookings, notes
      ) VALUES (
        teacher_record.user_id, day_num, '08:00:00', '12:00:00',
        true, 'teaching', 4, 'Morning teaching hours'
      );
      
      -- Afternoon session: 13:00-17:00
      INSERT INTO availability_slots (
        user_id, day_of_week, start_time, end_time,
        is_available, slot_type, max_bookings, notes
      ) VALUES (
        teacher_record.user_id, day_num, '13:00:00', '17:00:00',
        true, 'teaching', 4, 'Afternoon teaching hours'
      );
      
      -- Lunch break: 12:00-13:00
      INSERT INTO availability_slots (
        user_id, day_of_week, start_time, end_time,
        is_available, slot_type, max_bookings, notes
      ) VALUES (
        teacher_record.user_id, day_num, '12:00:00', '13:00:00',
        false, 'break', 0, 'Lunch break'
      );
    END LOOP;
    
    -- Saturday morning availability: 9:00-13:00
    INSERT INTO availability_slots (
      user_id, day_of_week, start_time, end_time,
      is_available, slot_type, max_bookings, notes
    ) VALUES (
      teacher_record.user_id, 6, '09:00:00', '13:00:00',
      true, 'teaching', 2, 'Saturday morning sessions'
    );
  END LOOP;
END $$;

-- Sample calendar events for next week
DO $$
DECLARE
  teacher_record RECORD;
  next_monday date;
BEGIN
  -- Calculate next Monday
  next_monday := CURRENT_DATE + (7 - EXTRACT(DOW FROM CURRENT_DATE) + 1)::integer;
  
  -- For each teacher, create some sample lessons
  FOR teacher_record IN 
    SELECT u.id as user_id 
    FROM users u 
    WHERE u.user_type = 'teacher' 
    LIMIT 2 -- Limit to first 2 teachers for demo
  LOOP
    -- Monday 9:00-10:30 - Mathematics lesson
    INSERT INTO calendar_events (
      user_id, title, description, start_time, end_time,
      event_type, subject_id, participants, location, status
    ) VALUES (
      teacher_record.user_id,
      'Matematyka - Algebra',
      'Wprowadzenie do równań liniowych',
      next_monday + '09:00:00'::time,
      next_monday + '10:30:00'::time,
      'lesson',
      (SELECT id FROM subjects WHERE name = 'Matematyka' LIMIT 1),
      '[]'::jsonb,
      'Sala 101',
      'scheduled'
    );
    
    -- Wednesday 14:00-15:30 - Physics lesson
    INSERT INTO calendar_events (
      user_id, title, description, start_time, end_time,
      event_type, subject_id, participants, location, status
    ) VALUES (
      teacher_record.user_id,
      'Fizyka - Mechanika',
      'Prawa Newtona',
      next_monday + 2 + '14:00:00'::time,
      next_monday + 2 + '15:30:00'::time,
      'lesson',
      (SELECT id FROM subjects WHERE name = 'Fizyka' LIMIT 1),
      '[]'::jsonb,
      'Laboratorium fizyczne',
      'scheduled'
    );
    
    -- Friday 10:00-11:00 - Individual consultation
    INSERT INTO calendar_events (
      user_id, title, description, start_time, end_time,
      event_type, participants, location, status
    ) VALUES (
      teacher_record.user_id,
      'Konsultacje indywidualne',
      'Pomoc w przygotowaniu do egzaminu',
      next_monday + 4 + '10:00:00'::time,
      next_monday + 4 + '11:00:00'::time,
      'meeting',
      '[]'::jsonb,
      'Gabinet nauczyciela',
      'scheduled'
    );
  END LOOP;
END $$;