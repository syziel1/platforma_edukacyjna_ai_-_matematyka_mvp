/*
  # Booking Requests System

  1. New Tables
    - `booking_requests`
      - `id` (uuid, primary key)
      - `requester_id` (uuid, foreign key to users - student or guardian)
      - `teacher_id` (uuid, foreign key to teachers)
      - `subject_id` (uuid, foreign key to subjects)
      - `requested_date` (date)
      - `requested_start_time` (time)
      - `requested_end_time` (time)
      - `duration_minutes` (integer)
      - `lesson_type` (text: 'individual', 'group', 'consultation')
      - `message` (text, optional)
      - `status` (text: 'pending', 'approved', 'rejected', 'cancelled')
      - `teacher_response` (text, optional)
      - `calendar_event_id` (uuid, optional foreign key to calendar_events)

  2. Security
    - Enable RLS on `booking_requests` table
    - Add policies for requesters to manage their requests
    - Add policies for teachers to view and respond to requests
*/

CREATE TABLE IF NOT EXISTS booking_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  teacher_id uuid NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES subjects(id) ON DELETE SET NULL,
  requested_date date NOT NULL,
  requested_start_time time NOT NULL,
  requested_end_time time NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 45,
  lesson_type text DEFAULT 'individual' CHECK (lesson_type IN ('individual', 'group', 'consultation')),
  message text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  teacher_response text,
  calendar_event_id uuid REFERENCES calendar_events(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Ensure valid time range
  CONSTRAINT valid_booking_time CHECK (requested_end_time > requested_start_time),
  
  -- Ensure duration matches time range
  CONSTRAINT valid_duration CHECK (
    duration_minutes = EXTRACT(EPOCH FROM (requested_end_time - requested_start_time)) / 60
  )
);

-- Enable RLS
ALTER TABLE booking_requests ENABLE ROW LEVEL SECURITY;

-- Requesters can manage their own booking requests
CREATE POLICY "Requesters can manage own booking requests"
  ON booking_requests
  FOR ALL
  TO authenticated
  USING (auth.uid() = requester_id)
  WITH CHECK (auth.uid() = requester_id);

-- Teachers can view and respond to their booking requests
CREATE POLICY "Teachers can manage their booking requests"
  ON booking_requests
  FOR ALL
  TO authenticated
  USING (auth.uid() = teacher_id)
  WITH CHECK (auth.uid() = teacher_id);

-- Guardians can view booking requests for their students
CREATE POLICY "Guardians can view their students booking requests"
  ON booking_requests
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM student_guardian sg
      JOIN users u ON u.id = auth.uid()
      WHERE sg.student_id = booking_requests.requester_id
      AND sg.guardian_id = auth.uid()
      AND u.user_type = 'guardian'
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_booking_requests_updated_at
  BEFORE UPDATE ON booking_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for efficient queries
CREATE INDEX idx_booking_requests_teacher ON booking_requests (teacher_id, status);
CREATE INDEX idx_booking_requests_requester ON booking_requests (requester_id, status);
CREATE INDEX idx_booking_requests_date ON booking_requests (requested_date, requested_start_time);