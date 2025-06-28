/*
  # Create subjects table

  1. New Tables
    - `subjects`
      - `id` (uuid, primary key)
      - `name` (text, unique) - subject name (e.g., "Matematyka", "Fizyka")
      - `description` (text) - subject description
      - `category` (text) - subject category (e.g., "STEM", "Languages", "Arts")
      - `active` (boolean) - whether subject is currently offered

  2. Security
    - Enable RLS on `subjects` table
    - Add policy for all authenticated users to read subjects
    - Add policy for teachers to manage subjects
*/

CREATE TABLE IF NOT EXISTS subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  category text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

-- Policy for all authenticated users to read active subjects
CREATE POLICY "All users can read active subjects"
  ON subjects
  FOR SELECT
  TO authenticated
  USING (active = true);

-- Policy for teachers to manage subjects
CREATE POLICY "Teachers can manage subjects"
  ON subjects
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.user_type = 'teacher'
    )
  );

-- Trigger to automatically update updated_at
CREATE TRIGGER update_subjects_updated_at
  BEFORE UPDATE ON subjects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some default subjects
INSERT INTO subjects (name, description, category) VALUES
  ('Matematyka', 'Nauka o liczbach, strukturach, przestrzeni i zmianach', 'STEM'),
  ('Fizyka', 'Nauka o materii, energii i ich wzajemnych oddziaływaniach', 'STEM'),
  ('Chemia', 'Nauka o składzie, strukturze i właściwościach materii', 'STEM'),
  ('Biologia', 'Nauka o życiu i organizmach żywych', 'STEM'),
  ('Język Polski', 'Nauka języka polskiego, literatury i komunikacji', 'Languages'),
  ('Język Angielski', 'Nauka języka angielskiego', 'Languages'),
  ('Historia', 'Nauka o przeszłości ludzkości', 'Humanities'),
  ('Geografia', 'Nauka o Ziemi i jej powierzchni', 'Humanities'),
  ('Informatyka', 'Nauka o przetwarzaniu informacji i programowaniu', 'STEM'),
  ('Plastyka', 'Edukacja artystyczna i twórcza', 'Arts')
ON CONFLICT (name) DO NOTHING;