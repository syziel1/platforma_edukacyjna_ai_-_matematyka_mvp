/*
  # Calendar Events System with Profiles Integration

  1. New Tables
    - `calendar_events`
      - `id` (uuid, primary key)
      - `profile_id` (uuid, foreign key to profiles)
      - `title` (text)
      - `description` (text, optional)
      - `start_time` (timestamptz)
      - `end_time` (timestamptz)
      - `event_type` (text: lesson, meeting, break, unavailable)
      - `participants` (jsonb array of profile IDs)
      - `subject_id` (uuid, optional foreign key to subjects)
      - `is_recurring` (boolean)
      - `recurrence_pattern` (jsonb, optional)
      - `status` (text: scheduled, confirmed, cancelled)
      - `location` (text, optional)
      - `notes` (text, optional)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `calendar_events` table
    - Add policies for profile owners, teachers, and guardians
*/

CREATE TABLE IF NOT EXISTS calendar_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('lesson', 'meeting', 'break', 'unavailable', 'consultation')),
  participants jsonb DEFAULT '[]'::jsonb,
  subject_id uuid REFERENCES subjects(id) ON DELETE SET NULL,
  is_recurring boolean DEFAULT false,
  recurrence_pattern jsonb,
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'cancelled', 'completed')),
  location text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_calendar_events_profile_id ON calendar_events(profile_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_start_time ON calendar_events(start_time);
CREATE INDEX IF NOT EXISTS idx_calendar_events_end_time ON calendar_events(end_time);
CREATE INDEX IF NOT EXISTS idx_calendar_events_status ON calendar_events(status);
CREATE INDEX IF NOT EXISTS idx_calendar_events_event_type ON calendar_events(event_type);

-- Enable RLS
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- Policies for calendar_events
CREATE POLICY "Users can manage their own calendar events"
  ON calendar_events
  FOR ALL
  TO authenticated
  USING (auth.uid() = profile_id)
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Teachers can view student calendar events"
  ON calendar_events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles teacher_profile
      WHERE teacher_profile.id = auth.uid()
      AND teacher_profile.user_type = 'teacher'
    )
    AND EXISTS (
      SELECT 1 FROM profiles student_profile
      WHERE student_profile.id = calendar_events.profile_id
      AND student_profile.user_type IN ('student', 'guardian')
    )
  );

CREATE POLICY "Guardians can view their students calendar events"
  ON calendar_events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles guardian_profile
      WHERE guardian_profile.id = auth.uid()
      AND guardian_profile.user_type = 'guardian'
    )
    AND EXISTS (
      SELECT 1 FROM student_guardians sg
      JOIN profiles student_profile ON student_profile.id = sg.student_id
      WHERE sg.guardian_id = auth.uid()
      AND student_profile.id = calendar_events.profile_id
    )
  );

-- Participants can view events they're invited to
CREATE POLICY "Participants can view events they're invited to"
  ON calendar_events
  FOR SELECT
  TO authenticated
  USING (
    participants ? auth.uid()::text
  );

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_calendar_events_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_calendar_events_updated_at
  BEFORE UPDATE ON calendar_events
  FOR EACH ROW
  EXECUTE FUNCTION update_calendar_events_updated_at();