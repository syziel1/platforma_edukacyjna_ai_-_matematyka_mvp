/*
  # Tabela użytkowników - podstawa systemu

  1. Nowa tabela
    - `users` - główna tabela z danymi wszystkich użytkowników
      - `id` (uuid, klucz główny)
      - `first_name` (text, imię)
      - `last_name` (text, nazwisko)
      - `email` (text, unikalny)
      - `phone` (text, telefon)
      - `date_of_birth` (date, data urodzenia)
      - `user_type` (text, typ: student/teacher/guardian)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Bezpieczeństwo
    - Włączone RLS (Row Level Security)
    - Polityki dostępu dla różnych typów użytkowników
    - Funkcja automatycznej aktualizacji updated_at
*/

-- Funkcja do automatycznej aktualizacji updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Główna tabela użytkowników
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  date_of_birth date NOT NULL,
  user_type text NOT NULL CHECK (user_type IN ('student', 'teacher', 'guardian')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Włącz Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Polityki dostępu
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Trigger do automatycznej aktualizacji updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();