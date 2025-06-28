/*
  # Create teacher_subjects relationship table

  1. New Tables
    - `teacher_subjects`
      - `teacher_id` (uuid, foreign key to teachers.id)
      - `subject_id` (uuid, foreign key to subjects.id)
      - `scope` (text) - teaching scope (e.g., "Algebra", "Mechanics")
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - Primary key: (teacher_id, subject_id)

  2. Security
    - Enable RLS on `teacher_subjects` table
    - Add policies for teachers to manage their subjects
    - Add policies for students to view teacher-subject relationships
*/

CREATE TABLE IF NOT EXISTS teacher_subjects (
  teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES subjects(id) ON DELETE CASCADE,
  scope text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  PRIMARY KEY (teacher_id, subject_id)
);

-- Enable RLS
ALTER TABLE teacher_subjects ENABLE ROW LEVEL SECURITY;

-- Teachers can manage their own subject assignments
CREATE POLICY "Teachers can manage own subjects"
  ON teacher_subjects
  FOR ALL
  TO authenticated
  USING (auth.uid() = teacher_id)
  WITH CHECK (auth.uid() = teacher_id);

-- Students and guardians can view teacher-subject relationships
CREATE POLICY "Students and guardians can view teacher subjects"
  ON teacher_subjects
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.user_type IN ('student', 'guardian')
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_teacher_subjects_updated_at
  BEFORE UPDATE ON teacher_subjects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();