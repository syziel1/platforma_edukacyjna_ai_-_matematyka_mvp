/*
  # Availability Slots System

  1. New Tables
    - `availability_slots`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `day_of_week` (integer: 0=Sunday, 1=Monday, ..., 6=Saturday)
      - `start_time` (time)
      - `end_time` (time)
      - `is_available` (boolean)
      - `slot_type` (text: 'teaching', 'meeting', 'break')
      - `max_bookings` (integer, for group sessions)
      - `notes` (text, optional)

  2. Security
    - Enable RLS on `availability_slots` table
    - Add policies for users to manage their own availability
    - Add policies for students/guardians to view teacher availability
*/

CREATE TABLE IF NOT EXISTS availability_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_available boolean DEFAULT true,
  slot_type text DEFAULT 'teaching' CHECK (slot_type IN ('teaching', 'meeting', 'break', 'personal')),
  max_bookings integer DEFAULT 1,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Ensure end_time is after start_time
  CONSTRAINT valid_time_slot CHECK (end_time > start_time),
  
  -- Prevent overlapping slots for the same user on the same day
  EXCLUDE USING gist (
    user_id WITH =,
    day_of_week WITH =,
    tsrange(start_time::text::timestamp, end_time::text::timestamp) WITH &&
  )
);

-- Enable RLS
ALTER TABLE availability_slots ENABLE ROW LEVEL SECURITY;

-- Users can manage their own availability
CREATE POLICY "Users can manage own availability"
  ON availability_slots
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Students and guardians can view teacher availability
CREATE POLICY "Students and guardians can view teacher availability"
  ON availability_slots
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users slot_user
      WHERE slot_user.id = availability_slots.user_id
      AND slot_user.user_type = 'teacher'
    )
    AND EXISTS (
      SELECT 1 FROM users requesting_user
      WHERE requesting_user.id = auth.uid()
      AND requesting_user.user_type IN ('student', 'guardian')
    )
  );

-- Teachers can view student availability (for scheduling purposes)
CREATE POLICY "Teachers can view student availability"
  ON availability_slots
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users teacher_user
      WHERE teacher_user.id = auth.uid()
      AND teacher_user.user_type = 'teacher'
    )
    AND EXISTS (
      SELECT 1 FROM users slot_user
      WHERE slot_user.id = availability_slots.user_id
      AND slot_user.user_type = 'student'
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_availability_slots_updated_at
  BEFORE UPDATE ON availability_slots
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create index for efficient queries
CREATE INDEX idx_availability_slots_user_day ON availability_slots (user_id, day_of_week);
CREATE INDEX idx_availability_slots_time ON availability_slots (day_of_week, start_time, end_time);