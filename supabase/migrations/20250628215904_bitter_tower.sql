/*
  # Create users table for student registration system

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - unique identifier linked to auth.users
      - `first_name` (text) - user's first name
      - `last_name` (text) - user's last name
      - `email` (text, unique) - user's email address
      - `phone` (text) - user's phone number
      - `date_of_birth` (date) - user's date of birth
      - `user_type` (text) - type of user (teacher, student, guardian)
      - `created_at` (timestamp) - when record was created
      - `updated_at` (timestamp) - when record was last updated

  2. Security
    - Enable RLS on `users` table
    - Add policies for users to manage their own data
    - Add policy for teachers to view student data
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  date_of_birth date NOT NULL,
  user_type text NOT NULL CHECK (user_type IN ('teacher', 'student', 'guardian')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can read and update their own data
CREATE POLICY "Users can manage own data"
  ON users
  FOR ALL
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Teachers can view student and guardian data (for their students)
CREATE POLICY "Teachers can view student data"
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

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();