/*
  # Create student_chosen_subjects table

  1. New Tables
    - `student_chosen_subjects`
      - `student_id` (uuid, foreign key to students.id)
      - `subject_id` (uuid, foreign key to subjects.id)
      - `teacher_id` (uuid, foreign key to teachers.id)
      - `enrollment_date` (date) - when student enrolled in subject
      - `status` (text) - enrollment status (active, completed, dropped)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - Primary key: (student_id, subject_id, teacher_id)

  2. Security
    - Enable RLS on `student_chosen_subjects` table
    - Add policies for students to manage their subject choices
    - Add policies for teachers to view their students
    - Add policies for guardians to view their students' choices
*/

CREATE TABLE IF NOT EXISTS student_chosen_subjects (
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
  enrollment_date date DEFAULT CURRENT_DATE,
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  PRIMARY KEY (student_id, subject_id, teacher_id),
  -- Ensure the teacher actually teaches this subject
  FOREIGN KEY (teacher_id, subject_id) REFERENCES teacher_subjects(teacher_id, subject_id)
);

-- Enable RLS
ALTER TABLE student_chosen_subjects ENABLE ROW LEVEL SECURITY;

-- Students can manage their own subject choices
CREATE POLICY "Students can manage own subject choices"
  ON student_chosen_subjects
  FOR ALL
  TO authenticated
  USING (auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id);

-- Teachers can view their students' enrollments
CREATE POLICY "Teachers can view their students enrollments"
  ON student_chosen_subjects
  FOR SELECT
  TO authenticated
  USING (auth.uid() = teacher_id);

-- Guardians can view their students' subject choices
CREATE POLICY "Guardians can view their students subject choices"
  ON student_chosen_subjects
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM student_guardian sg
      JOIN users u ON u.id = auth.uid()
      WHERE sg.student_id = student_chosen_subjects.student_id
      AND sg.guardian_id = auth.uid()
      AND u.user_type = 'guardian'
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_student_chosen_subjects_updated_at
  BEFORE UPDATE ON student_chosen_subjects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();