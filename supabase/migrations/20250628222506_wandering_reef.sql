/*
  # Booking Requests System with Profiles Integration

  1. New Tables
    - `booking_requests`
      - `id` (uuid, primary key)
      - `requester_id` (uuid, foreign key to profiles - student/guardian)
      - `teacher_id` (uuid, foreign key to profiles - teacher)
      - `subject_id` (uuid, foreign key to subjects)
      - `requested_start_time` (timestamptz)
      - `requested_end_time` (timestamptz)
      - `message` (text, optional)
      - `status` (text: pending, approved, rejected, cancelled)
      - `teacher_response` (text, optional)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `responded_at` (timestamptz, optional)

  2. Security
    - Enable RLS on `booking_requests` table
    - Add policies for requesters, teachers, and guardians
*/

CREATE TABLE IF NOT EXISTS booking_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  teacher_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES subjects(id) ON DELETE SET NULL,
  requested_start_time timestamptz NOT NULL,
  requested_end_time timestamptz NOT NULL,
  message text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  teacher_response text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  responded_at timestamptz,
  
  -- Ensure valid time range
  CONSTRAINT valid_requested_time_range CHECK (requested_start_time < requested_end_time),
  
  -- Ensure teacher is actually a teacher
  CONSTRAINT valid_teacher CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = teacher_id AND user_type = 'teacher'
    )
  )
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_booking_requests_requester_id ON booking_requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_booking_requests_teacher_id ON booking_requests(teacher_id);
CREATE INDEX IF NOT EXISTS idx_booking_requests_status ON booking_requests(status);
CREATE INDEX IF NOT EXISTS idx_booking_requests_start_time ON booking_requests(requested_start_time);

-- Enable RLS
ALTER TABLE booking_requests ENABLE ROW LEVEL SECURITY;

-- Policies for booking_requests
CREATE POLICY "Users can manage their own booking requests"
  ON booking_requests
  FOR ALL
  TO authenticated
  USING (auth.uid() = requester_id)
  WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Teachers can manage requests directed to them"
  ON booking_requests
  FOR ALL
  TO authenticated
  USING (auth.uid() = teacher_id)
  WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Guardians can view requests for their students"
  ON booking_requests
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM student_guardians sg
      WHERE sg.guardian_id = auth.uid()
      AND sg.student_id = booking_requests.requester_id
    )
  );

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_booking_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  IF NEW.status != OLD.status AND NEW.status IN ('approved', 'rejected') THEN
    NEW.responded_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_booking_requests_updated_at
  BEFORE UPDATE ON booking_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_booking_requests_updated_at();