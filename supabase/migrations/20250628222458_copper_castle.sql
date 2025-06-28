/*
  # Availability Slots System with Profiles Integration

  1. New Tables
    - `availability_slots`
      - `id` (uuid, primary key)
      - `profile_id` (uuid, foreign key to profiles)
      - `day_of_week` (integer: 0=Sunday, 1=Monday, etc.)
      - `start_time` (time)
      - `end_time` (time)
      - `slot_type` (text: teaching, meeting, consultation, break)
      - `max_bookings` (integer, default 1)
      - `is_active` (boolean, default true)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `availability_slots` table
    - Add policies for profile management and visibility
*/

CREATE TABLE IF NOT EXISTS availability_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  slot_type text NOT NULL CHECK (slot_type IN ('teaching', 'meeting', 'consultation', 'break')),
  max_bookings integer DEFAULT 1 CHECK (max_bookings > 0),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Ensure start_time is before end_time
  CONSTRAINT valid_time_range CHECK (start_time < end_time)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_availability_slots_profile_id ON availability_slots(profile_id);
CREATE INDEX IF NOT EXISTS idx_availability_slots_day_of_week ON availability_slots(day_of_week);
CREATE INDEX IF NOT EXISTS idx_availability_slots_active ON availability_slots(is_active);

-- Enable RLS
ALTER TABLE availability_slots ENABLE ROW LEVEL SECURITY;

-- Policies for availability_slots
CREATE POLICY "Users can manage their own availability slots"
  ON availability_slots
  FOR ALL
  TO authenticated
  USING (auth.uid() = profile_id)
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Everyone can view active availability slots"
  ON availability_slots
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_availability_slots_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_availability_slots_updated_at
  BEFORE UPDATE ON availability_slots
  FOR EACH ROW
  EXECUTE FUNCTION update_availability_slots_updated_at();