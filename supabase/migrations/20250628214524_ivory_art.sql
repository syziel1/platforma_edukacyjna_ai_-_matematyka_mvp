/*
  # Create teachers table

  1. New Tables
    - `teachers`
      - `id` (uuid, primary key, foreign key to users.id)
      - `bio` (text) - teacher's biography/description
      - `qualifications` (text) - teacher's qualifications
      - `hire_date` (date) - when teacher was hired
      - `status` (text) - teacher status (active, inactive)

  2. Security
    - Enable RLS on `teachers` table
    - Add policies for teachers to read and update their own data
    - Add policies for students to read teacher data
*/

CREATE TABLE IF NOT EXISTS teachers (
  id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  bio text,
  qualifications text,
  hire_date date DEFAULT CURRENT_DATE,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

-- Policy for teachers to read and update their own data
CREATE POLICY "Teachers can read own data"
  ON teachers
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Teachers can update own data"
  ON teachers
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Policy for students and guardians to read teacher data
CREATE POLICY "Students and guardians can read teacher data"
  ON teachers
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.user_type IN ('student', 'guardian')
    )
  );

-- Trigger to automatically update updated_at
CREATE TRIGGER update_teachers_updated_at
  BEFORE UPDATE ON teachers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();