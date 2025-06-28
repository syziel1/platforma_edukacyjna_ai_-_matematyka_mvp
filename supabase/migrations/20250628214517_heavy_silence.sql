/*
  # Create students table

  1. New Tables
    - `students`
      - `id` (uuid, primary key, foreign key to users.id)
      - `student_id_number` (text, unique) - unique student identification number
      - `grade_level` (text) - student's grade level (e.g., "Klasa 8")
      - `enrollment_date` (date) - when student enrolled
      - `status` (text) - student status (active, inactive, graduated)

  2. Security
    - Enable RLS on `students` table
    - Add policies for students to read their own data
    - Add policies for teachers and guardians to read student data
*/

CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  student_id_number text UNIQUE NOT NULL,
  grade_level text,
  enrollment_date date DEFAULT CURRENT_DATE,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Policy for students to read their own data
CREATE POLICY "Students can read own data"
  ON students
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policy for students to update their own data
CREATE POLICY "Students can update own data"
  ON students
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Policy for teachers to read student data
CREATE POLICY "Teachers can read student data"
  ON students
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.user_type = 'teacher'
    )
  );

-- Policy for guardians to read their students' data
CREATE POLICY "Guardians can read their students data"
  ON students
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM student_guardian sg
      JOIN users u ON u.id = auth.uid()
      WHERE sg.student_id = students.id
      AND sg.guardian_id = auth.uid()
      AND u.user_type = 'guardian'
    )
  );

-- Trigger to automatically update updated_at
CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON students
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();