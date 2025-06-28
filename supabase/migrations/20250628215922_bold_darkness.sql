/*
  # Create guardians table

  1. New Tables
    - `guardians`
      - `id` (uuid, primary key, foreign key to users.id)
      - `relationship_to_student` (text) - relationship type (mother, father, etc.)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `guardians` table
    - Add policies for guardians to manage their own data
    - Add policies for teachers to view guardian data
*/

CREATE TABLE IF NOT EXISTS guardians (
  id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  relationship_to_student text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE guardians ENABLE ROW LEVEL SECURITY;

-- Guardians can manage their own data
CREATE POLICY "Guardians can manage own data"
  ON guardians
  FOR ALL
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Teachers can view guardian data
CREATE POLICY "Teachers can view guardian data"
  ON guardians
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.user_type = 'teacher'
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_guardians_updated_at
  BEFORE UPDATE ON guardians
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();