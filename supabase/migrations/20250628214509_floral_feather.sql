/*
  # Create users table

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - unique identifier linked to auth.users
      - `first_name` (text) - user's first name
      - `last_name` (text) - user's last name
      - `email` (text, unique) - user's email address
      - `phone` (text) - user's phone number
      - `date_of_birth` (date) - user's date of birth
      - `user_type` (text) - type of user (teacher, student, guardian)
      - `created_at` (timestamp) - when the record was created
      - `updated_at` (timestamp) - when the record was last updated

  2. Security
    - Enable RLS on `users` table
    - Add policy for users to read and update their own data
    - Add policy for teachers to read student data
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  date_of_birth date,
  user_type text NOT NULL CHECK (user_type IN ('teacher', 'student', 'guardian')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy for users to read and update their own data
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

-- Policy for teachers to read student and guardian data
CREATE POLICY "Teachers can read student and guardian data"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users teacher_user
      WHERE teacher_user.id = auth.uid()
      AND teacher_user.user_type = 'teacher'
    )
    AND user_type IN ('student', 'guardian')
  );

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();