/*
  # Sample Calendar and Availability Data with Profiles Integration

  1. Sample Data
    - Availability slots for teachers
    - Sample calendar events
    - Sample booking requests

  Note: This assumes profiles already exist with appropriate user_types
*/

-- Insert sample availability slots for teachers
-- (This will only work if teacher profiles already exist)

DO $$
DECLARE
  teacher_profile_id uuid;
BEGIN
  -- Get a teacher profile ID (if any exists)
  SELECT id INTO teacher_profile_id 
  FROM profiles 
  WHERE user_type = 'teacher' 
  LIMIT 1;
  
  IF teacher_profile_id IS NOT NULL THEN
    -- Monday to Friday: 8:00 AM - 5:00 PM (with lunch break)
    INSERT INTO availability_slots (profile_id, day_of_week, start_time, end_time, slot_type, max_bookings) VALUES
    -- Monday
    (teacher_profile_id, 1, '08:00'::time, '12:00'::time, 'teaching', 1),
    (teacher_profile_id, 1, '12:00'::time, '13:00'::time, 'break', 0),
    (teacher_profile_id, 1, '13:00'::time, '17:00'::time, 'teaching', 1),
    
    -- Tuesday
    (teacher_profile_id, 2, '08:00'::time, '12:00'::time, 'teaching', 1),
    (teacher_profile_id, 2, '12:00'::time, '13:00'::time, 'break', 0),
    (teacher_profile_id, 2, '13:00'::time, '17:00'::time, 'consultation', 2),
    
    -- Wednesday
    (teacher_profile_id, 3, '08:00'::time, '12:00'::time, 'teaching', 1),
    (teacher_profile_id, 3, '12:00'::time, '13:00'::time, 'break', 0),
    (teacher_profile_id, 3, '13:00'::time, '17:00'::time, 'teaching', 1),
    
    -- Thursday
    (teacher_profile_id, 4, '08:00'::time, '12:00'::time, 'teaching', 1),
    (teacher_profile_id, 4, '12:00'::time, '13:00'::time, 'break', 0),
    (teacher_profile_id, 4, '13:00'::time, '17:00'::time, 'consultation', 2),
    
    -- Friday
    (teacher_profile_id, 5, '08:00'::time, '12:00'::time, 'teaching', 1),
    (teacher_profile_id, 5, '12:00'::time, '13:00'::time, 'break', 0),
    (teacher_profile_id, 5, '13:00'::time, '16:00'::time, 'teaching', 1),
    
    -- Saturday (shorter hours)
    (teacher_profile_id, 6, '09:00'::time, '13:00'::time, 'consultation', 3);
    
    -- Insert sample calendar events
    INSERT INTO calendar_events (
      profile_id, title, description, start_time, end_time, 
      event_type, status, location
    ) VALUES
    (
      teacher_profile_id,
      'Matematyka - Lekcja grupowa',
      'Wprowadzenie do funkcji kwadratowych',
      (CURRENT_DATE + interval '1 day' + time '10:00')::timestamptz,
      (CURRENT_DATE + interval '1 day' + time '11:30')::timestamptz,
      'lesson',
      'scheduled',
      'Sala 101'
    ),
    (
      teacher_profile_id,
      'Konsultacje indywidualne',
      'Pomoc w przygotowaniu do egzaminu',
      (CURRENT_DATE + interval '2 days' + time '14:00')::timestamptz,
      (CURRENT_DATE + interval '2 days' + time '14:45')::timestamptz,
      'consultation',
      'confirmed',
      'Gabinet nauczycielski'
    );
    
    RAISE NOTICE 'Sample calendar data inserted for teacher profile: %', teacher_profile_id;
  ELSE
    RAISE NOTICE 'No teacher profiles found. Please create teacher profiles first.';
  END IF;
END $$;

-- Insert sample booking request (if student profile exists)
DO $$
DECLARE
  teacher_profile_id uuid;
  student_profile_id uuid;
  math_subject_id uuid;
BEGIN
  -- Get teacher and student profile IDs
  SELECT id INTO teacher_profile_id 
  FROM profiles 
  WHERE user_type = 'teacher' 
  LIMIT 1;
  
  SELECT id INTO student_profile_id 
  FROM profiles 
  WHERE user_type = 'student' 
  LIMIT 1;
  
  SELECT id INTO math_subject_id 
  FROM subjects 
  WHERE name ILIKE '%matematyka%' OR name ILIKE '%math%'
  LIMIT 1;
  
  IF teacher_profile_id IS NOT NULL AND student_profile_id IS NOT NULL THEN
    INSERT INTO booking_requests (
      requester_id, teacher_id, subject_id,
      requested_start_time, requested_end_time,
      message, status
    ) VALUES
    (
      student_profile_id,
      teacher_profile_id,
      math_subject_id,
      (CURRENT_DATE + interval '3 days' + time '15:00')::timestamptz,
      (CURRENT_DATE + interval '3 days' + time '16:00')::timestamptz,
      'Potrzebuję pomocy z równaniami kwadratowymi przed sprawdzianem.',
      'pending'
    );
    
    RAISE NOTICE 'Sample booking request created between student % and teacher %', student_profile_id, teacher_profile_id;
  ELSE
    RAISE NOTICE 'Missing profiles. Teacher: %, Student: %', teacher_profile_id, student_profile_id;
  END IF;
END $$;