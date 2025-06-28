/*
  # Create student_guardian junction table

  1. New Tables
    - `student_guardian`
      - `student_id` (uuid, foreign key to students.id)
      - `guardian_id` (uuid, foreign key to guardians.id)
      - `primary_guardian` (boolean) - whether this is the primary guardian
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `student_guardian` table
    - Add policies for students and guardians to read their relationships
    - Add policies for teachers to read student-guardian relationships
*/

CREATE TABLE IF NOT EXISTS student_guardian (
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  guardian_id uuid REFERENCES guardians(id) ON DELETE CASCADE,
  primary_guardian boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (student_id, guardian_id)
);

-- Enable Row Level Security
ALTER TABLE student_guardian ENABLE ROW LEVEL SECURITY;

-- Policy for students to read their guardian relationships
CREATE POLICY "Students can read their guardian relationships"
  ON student_guardian
  FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id);

-- Policy for guardians to read their student relationships
CREATE POLICY "Guardians can read their student relationships"
  ON student_guardian
  FOR SELECT
  TO authenticated
  USING (auth.uid() = guardian_id);

-- Policy for teachers to read all student-guardian relationships
CREATE POLICY "Teachers can read student guardian relationships"
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

-- Policy for guardians to insert/update their relationships
CREATE POLICY "Guardians can manage their student relationships"
  ON student_guardian
  FOR ALL
  TO authenticated
  USING (auth.uid() = guardian_id);