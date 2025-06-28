/*
  # Create student_guardian relationship table

  1. New Tables
    - `student_guardian`
      - `student_id` (uuid, foreign key to students.id)
      - `guardian_id` (uuid, foreign key to guardians.id)
      - `created_at` (timestamp)
      - Primary key: (student_id, guardian_id)

  2. Security
    - Enable RLS on `student_guardian` table
    - Add policies for guardians and students to view their relationships
    - Add policies for teachers to view relationships
*/

CREATE TABLE IF NOT EXISTS student_guardian (
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  guardian_id uuid REFERENCES guardians(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (student_id, guardian_id)
);

-- Enable RLS
ALTER TABLE student_guardian ENABLE ROW LEVEL SECURITY;

-- Students can view their guardian relationships
CREATE POLICY "Students can view their guardians"
  ON student_guardian
  FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id);

-- Guardians can view their student relationships
CREATE POLICY "Guardians can view their students"
  ON student_guardian
  FOR SELECT
  TO authenticated
  USING (auth.uid() = guardian_id);

-- Teachers can view all relationships
CREATE POLICY "Teachers can view all relationships"
  ON student_guardian
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.user_type = 'teacher'
    )
  );

-- Guardians can manage their relationships with students
CREATE POLICY "Guardians can manage student relationships"
  ON student_guardian
  FOR ALL
  TO authenticated
  USING (auth.uid() = guardian_id)
  WITH CHECK (auth.uid() = guardian_id);