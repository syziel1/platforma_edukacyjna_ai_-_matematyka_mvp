/*
  # Create useful views for easier data access

  1. Views
    - `student_details` - Complete student information with user data
    - `teacher_details` - Complete teacher information with user data
    - `guardian_details` - Complete guardian information with user data
    - `student_enrollments` - Student enrollments with subject and teacher details
    - `teacher_classes` - Teacher classes with student counts
*/

-- View for complete student information
CREATE OR REPLACE VIEW student_details AS
SELECT 
  s.id,
  s.student_id_number,
  s.grade_level,
  s.enrollment_date,
  s.status as student_status,
  u.first_name,
  u.last_name,
  u.email,
  u.phone,
  u.date_of_birth,
  u.created_at,
  u.updated_at
FROM students s
JOIN users u ON s.id = u.id;

-- View for complete teacher information
CREATE OR REPLACE VIEW teacher_details AS
SELECT 
  t.id,
  t.bio,
  t.qualifications,
  t.hire_date,
  t.status as teacher_status,
  u.first_name,
  u.last_name,
  u.email,
  u.phone,
  u.date_of_birth,
  u.created_at,
  u.updated_at
FROM teachers t
JOIN users u ON t.id = u.id;

-- View for complete guardian information
CREATE OR REPLACE VIEW guardian_details AS
SELECT 
  g.id,
  g.relationship_to_student,
  g.emergency_contact,
  g.can_pick_up_student,
  u.first_name,
  u.last_name,
  u.email,
  u.phone,
  u.date_of_birth,
  u.created_at,
  u.updated_at
FROM guardians g
JOIN users u ON g.id = u.id;

-- View for student enrollments with details
CREATE OR REPLACE VIEW student_enrollments AS
SELECT 
  scs.student_id,
  scs.subject_id,
  scs.teacher_id,
  scs.enrollment_date,
  scs.status,
  scs.grade,
  scs.notes,
  sd.first_name as student_first_name,
  sd.last_name as student_last_name,
  sd.student_id_number,
  sub.name as subject_name,
  sub.description as subject_description,
  td.first_name as teacher_first_name,
  td.last_name as teacher_last_name,
  ts.scope,
  ts.level
FROM student_chosen_subjects scs
JOIN student_details sd ON scs.student_id = sd.id
JOIN subjects sub ON scs.subject_id = sub.id
JOIN teacher_details td ON scs.teacher_id = td.id
JOIN teacher_subjects ts ON scs.teacher_id = ts.teacher_id AND scs.subject_id = ts.subject_id;

-- View for teacher classes with student counts
CREATE OR REPLACE VIEW teacher_classes AS
SELECT 
  ts.teacher_id,
  ts.subject_id,
  td.first_name as teacher_first_name,
  td.last_name as teacher_last_name,
  sub.name as subject_name,
  ts.scope,
  ts.level,
  ts.max_students,
  COUNT(scs.student_id) as current_students,
  ts.max_students - COUNT(scs.student_id) as available_spots
FROM teacher_subjects ts
JOIN teacher_details td ON ts.teacher_id = td.id
JOIN subjects sub ON ts.subject_id = sub.id
LEFT JOIN student_chosen_subjects scs ON ts.teacher_id = scs.teacher_id 
  AND ts.subject_id = scs.subject_id 
  AND scs.status = 'active'
WHERE ts.active = true
GROUP BY ts.teacher_id, ts.subject_id, td.first_name, td.last_name, 
         sub.name, ts.scope, ts.level, ts.max_students;