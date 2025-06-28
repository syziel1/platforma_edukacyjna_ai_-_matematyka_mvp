/*
  # Create teachers table

  1. New Tables
    - `teachers`
      - `id` (uuid, primary key, foreign key to users.id)
      - `bio` (text) - teacher's biography/description
      - `qualifications` (text) - teacher's qualifications
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `teachers` table
    - Add policies for teachers to manage their own data
    - Add policies for students to view teacher data
*/

CREATE TABLE IF NOT EXISTS teachers (
  id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  bio text,
  qualifications text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

-- Teachers can manage their own data
CREATE POLICY "Teachers can manage own data"
  ON teachers
  FOR ALL
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Students and guardians can view teacher data
CREATE POLICY "Students and guardians can view teacher data"
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

-- Create trigger for updated_at
CREATE TRIGGER update_teachers_updated_at
  BEFORE UPDATE ON teachers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();