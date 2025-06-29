/*
  # Create students table

  1. New Tables
    - `students`
      - `id` (uuid, primary key, foreign key to users.id)
      - `student_id_number` (text, unique) - unique student identifier
      - `grade_level` (text) - student's grade level
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `students` table
    - Add policies for students to read their own data
    - Add policies for teachers and guardians to access student data
*/

CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  student_id_number text UNIQUE NOT NULL,
  grade_level text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Students can read their own data
CREATE POLICY "Students can read own data"
  ON students
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Teachers can view all student data
CREATE POLICY "Teachers can view student data"
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

-- Guardians can view their students' data
CREATE POLICY "Guardians can view their students data"
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

-- Create trigger for updated_at
CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON students
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();