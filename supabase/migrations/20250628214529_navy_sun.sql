/*
  # Create guardians table

  1. New Tables
    - `guardians`
      - `id` (uuid, primary key, foreign key to users.id)
      - `relationship_to_student` (text) - relationship type (mother, father, guardian, etc.)
      - `emergency_contact` (boolean) - whether this guardian is emergency contact
      - `can_pick_up_student` (boolean) - whether guardian can pick up student

  2. Security
    - Enable RLS on `guardians` table
    - Add policies for guardians to read and update their own data
    - Add policies for teachers to read guardian data
*/

CREATE TABLE IF NOT EXISTS guardians (
  id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  relationship_to_student text NOT NULL,
  emergency_contact boolean DEFAULT false,
  can_pick_up_student boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE guardians ENABLE ROW LEVEL SECURITY;

-- Policy for guardians to read and update their own data
CREATE POLICY "Guardians can read own data"
  ON guardians
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Guardians can update own data"
  ON guardians
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Policy for teachers to read guardian data
CREATE POLICY "Teachers can read guardian data"
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

-- Trigger to automatically update updated_at
CREATE TRIGGER update_guardians_updated_at
  BEFORE UPDATE ON guardians
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();