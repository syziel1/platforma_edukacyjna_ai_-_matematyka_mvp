/*
  # Create student_chosen_subjects table

  1. New Tables
    - `student_chosen_subjects`
      - `student_id` (uuid, foreign key to students.id)
      - `subject_id` (uuid, foreign key to subjects.id)
      - `teacher_id` (uuid, foreign key to teachers.id)
      - `enrollment_date` (date) - when student enrolled in this subject
      - `status` (text) - enrollment status
      - `grade` (text) - current grade in subject
      - `notes` (text) - additional notes

  2. Security
    - Enable RLS on `student_chosen_subjects` table
    - Add policies for students to read and manage their enrollments
    - Add policies for teachers to read their students' enrollments
    - Add policies for guardians to read their students' enrollments
*/

CREATE TABLE IF NOT EXISTS student_chosen_subjects (
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
  enrollment_date date DEFAULT CURRENT_DATE,
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped', 'pending')),
  grade text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  PRIMARY KEY (student_id, subject_id, teacher_id),
  -- Ensure the teacher actually teaches this subject
  FOREIGN KEY (teacher_id, subject_id) REFERENCES teacher_subjects(teacher_id, subject_id)
);

-- Enable Row Level Security
ALTER TABLE student_chosen_subjects ENABLE ROW LEVEL SECURITY;

-- Policy for students to read and manage their own enrollments
CREATE POLICY "Students can read their own enrollments"
  ON student_chosen_subjects
  FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id);

CREATE POLICY "Students can enroll in subjects"
  ON student_chosen_subjects
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their own enrollments"
  ON student_chosen_subjects
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = student_id);

-- Policy for teachers to read and manage their students' enrollments
CREATE POLICY "Teachers can read their students enrollments"
  ON student_chosen_subjects
  FOR SELECT
  TO authenticated
  USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can update their students enrollments"
  ON student_chosen_subjects
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = teacher_id);

-- Policy for guardians to read their students' enrollments
CREATE POLICY "Guardians can read their students enrollments"
  ON student_chosen_subjects
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM student_guardian sg
      JOIN users u ON u.id = auth.uid()
      WHERE sg.student_id = student_chosen_subjects.student_id
      AND sg.guardian_id = auth.uid()
      AND u.user_type = 'guardian'
    )
  );

-- Trigger to automatically update updated_at
CREATE TRIGGER update_student_chosen_subjects_updated_at
  BEFORE UPDATE ON student_chosen_subjects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();