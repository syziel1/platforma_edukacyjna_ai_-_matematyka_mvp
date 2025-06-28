/*
  # Sprawdzenie tabeli users

  1. Sprawdzenie struktury tabeli users
  2. Weryfikacja polityk bezpieczeństwa
  3. Sprawdzenie triggerów
*/

-- Sprawdź czy tabela users istnieje
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'users';

-- Sprawdź strukturę tabeli users
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'users'
ORDER BY ordinal_position;

-- Sprawdź polityki RLS dla tabeli users
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'users';

-- Sprawdź czy RLS jest włączone
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'users';

-- Sprawdź triggery
SELECT 
  trigger_name,
  event_manipulation,
  action_timing,
  action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'users';