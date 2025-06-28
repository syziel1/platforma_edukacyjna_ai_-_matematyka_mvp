/*
  # Create teacher_subjects junction table

  1. New Tables
    - `teacher_subjects`
      - `teacher_id` (uuid, foreign key to teachers.id)
      - `subject_id` (uuid, foreign key to subjects.id)
      - `scope` (text) - teaching scope (e.g., "Algebra", "Mechanika")
      - `level` (text) - teaching level (e.g., "podstawowy", "rozszerzony")
      - `max_students` (integer) - maximum number of students for this teacher-subject combination
      - `active` (boolean) - whether teacher is currently teaching this subject

  2. Security
    - Enable RLS on `teacher_subjects` table
    - Add policies for teachers to manage their subjects
    - Add policies for students to read teacher-subject combinations
*/

CREATE TABLE IF NOT EXISTS teacher_subjects (
  teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES subjects(id) ON DELETE CASCADE,
  scope text,
  level text DEFAULT 'podstawowy' CHECK (level IN ('podstawowy', 'rozszerzony', 'maturalny')),
  max_students integer DEFAULT 30,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  PRIMARY KEY (teacher_id, subject_id)
);

-- Enable Row Level Security
ALTER TABLE teacher_subjects ENABLE ROW LEVEL SECURITY;

-- Policy for teachers to manage their own subjects
CREATE POLICY "Teachers can manage their own subjects"
  ON teacher_subjects
  FOR ALL
  TO authenticated
  USING (auth.uid() = teacher_id);

-- Policy for students and guardians to read active teacher-subject combinations
CREATE POLICY "Students and guardians can read teacher subjects"
  ON teacher_subjects
  FOR SELECT
  TO authenticated
  USING (
    active = true AND
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.user_type IN ('student', 'guardian')
    )
  );

-- Policy for all teachers to read other teachers' subjects (for coordination)
CREATE POLICY "Teachers can read all teacher subjects"
  ON teacher_subjects
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.user_type = 'teacher'
    )
  );

-- Trigger to automatically update updated_at
CREATE TRIGGER update_teacher_subjects_updated_at
  BEFORE UPDATE ON teacher_subjects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();