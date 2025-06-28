/*
  # Insert sample data for testing

  1. Sample Data
    - Sample subjects (Mathematics, Physics, Chemistry, etc.)
    - Sample users (teachers, students, guardians)
    - Sample relationships

  Note: This is for testing purposes only
*/

-- Insert sample subjects
INSERT INTO subjects (name, description) VALUES
  ('Matematyka', 'Nauka o liczbach, strukturach, przestrzeni i zmianach'),
  ('Fizyka', 'Nauka o materii, energii i ich wzajemnych oddziaływaniach'),
  ('Chemia', 'Nauka o składzie, strukturze i właściwościach materii'),
  ('Biologia', 'Nauka o życiu i organizmach żywych'),
  ('Historia', 'Nauka o przeszłości ludzkości'),
  ('Geografia', 'Nauka o Ziemi i jej powierzchni'),
  ('Język Polski', 'Nauka języka polskiego, literatury i kultury'),
  ('Język Angielski', 'Nauka języka angielskiego')
ON CONFLICT (name) DO NOTHING;

-- Note: Sample users should be created through the application interface
-- or through Supabase Auth, as they need to be properly linked to auth.users