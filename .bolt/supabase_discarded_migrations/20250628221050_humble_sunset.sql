/*
  # Calendar Events System

  1. New Tables
    - `calendar_events`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `title` (text)
      - `description` (text, optional)
      - `start_time` (timestamptz)
      - `end_time` (timestamptz)
      - `event_type` (text: 'lesson', 'meeting', 'break', 'unavailable')
      - `subject_id` (uuid, optional foreign key to subjects)
      - `participants` (jsonb array of user IDs)
      - `location` (text, optional)
      - `is_recurring` (boolean)
      - `recurrence_pattern` (jsonb, optional)
      - `status` (text: 'scheduled', 'confirmed', 'cancelled', 'completed')

  2. Security
    - Enable RLS on `calendar_events` table
    - Add policies for users to manage their own events
    - Add policies for participants to view events they're part of
    - Add policies for teachers to view their students' events
*/

CREATE TABLE IF NOT EXISTS calendar_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('lesson', 'meeting', 'break', 'unavailable', 'available')),
  subject_id uuid REFERENCES subjects(id) ON DELETE SET NULL,
  participants jsonb DEFAULT '[]'::jsonb,
  location text,
  is_recurring boolean DEFAULT false,
  recurrence_pattern jsonb,
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'cancelled', 'completed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Ensure end_time is after start_time
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- Enable RLS
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- Users can manage their own events
CREATE POLICY "Users can manage own events"
  ON calendar_events
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can view events where they are participants
CREATE POLICY "Users can view events they participate in"
  ON calendar_events
  FOR SELECT
  TO authenticated
  USING (
    participants ? auth.uid()::text
    OR auth.uid() = user_id
  );

-- Teachers can view their students' events
CREATE POLICY "Teachers can view student events"
  ON calendar_events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users teacher_user
      WHERE teacher_user.id = auth.uid()
      AND teacher_user.user_type = 'teacher'
    )
    AND EXISTS (
      SELECT 1 FROM users event_user
      WHERE event_user.id = calendar_events.user_id
      AND event_user.user_type = 'student'
    )
  );

-- Guardians can view their students' events
CREATE POLICY "Guardians can view their students events"
  ON calendar_events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM student_guardian sg
      JOIN users u ON u.id = auth.uid()
      WHERE sg.student_id = calendar_events.user_id
      AND sg.guardian_id = auth.uid()
      AND u.user_type = 'guardian'
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_calendar_events_updated_at
  BEFORE UPDATE ON calendar_events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create index for efficient time-based queries
CREATE INDEX idx_calendar_events_time_range ON calendar_events (user_id, start_time, end_time);
CREATE INDEX idx_calendar_events_participants ON calendar_events USING GIN (participants);