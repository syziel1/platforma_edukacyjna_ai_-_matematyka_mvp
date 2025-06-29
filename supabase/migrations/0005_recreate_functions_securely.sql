/*
 * KROK 6: OSTATECZNE CZYSZCZENIE I ZABEZPIECZENIE FUNKCJI
 *
 * Ta migracja najpierw usuwa wszystkie potencjalnie istniejące wersje funkcji
 * (w tym stare i nieużywane), a następnie tworzy je na nowo z poprawnymi
 * ustawieniami bezpieczeństwa (SET search_path), eliminując wszystkie
 * ostrzeżenia `function_search_path_mutable`.
 */

-- Usuwamy wszystkie stare i potencjalnie błędne wersje funkcji.
-- Używamy `DROP FUNCTION IF EXISTS`, aby uniknąć błędów, jeśli funkcja nie istnieje.
DROP FUNCTION IF EXISTS public.handle_updated_at();
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.log_event();
DROP FUNCTION IF EXISTS public.get_user_role(uuid);
DROP FUNCTION IF EXISTS public.update_updated_at_column(); -- Usunięcie starej, nieużywanej funkcji

-- Tworzymy funkcje od nowa w bezpieczny sposób.

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;


CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    (NEW.raw_user_meta_data->>'role')::user_role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;


CREATE OR REPLACE FUNCTION public.log_event()
RETURNS TRIGGER AS $$
DECLARE
  user_id_val uuid;
BEGIN
  user_id_val := auth.uid();
  INSERT INTO public.event_log (user_id, action, table_name, record_id, details)
  VALUES (user_id_val, TG_OP, TG_TABLE_NAME,
    CASE TG_OP
      WHEN 'INSERT' THEN NEW.id::text WHEN 'UPDATE' THEN NEW.id::text WHEN 'DELETE' THEN OLD.id::text
    END,
    CASE TG_OP
      WHEN 'INSERT' THEN jsonb_build_object('new_data', to_jsonb(NEW))
      WHEN 'UPDATE' THEN jsonb_build_object('old_data', to_jsonb(OLD), 'new_data', to_jsonb(NEW))
      WHEN 'DELETE' THEN jsonb_build_object('old_data', to_jsonb(OLD))
    END
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;


CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS text AS $$
DECLARE
  user_role_val text;
BEGIN
  SELECT role::text INTO user_role_val FROM public.profiles WHERE id = user_id;
  RETURN user_role_val;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;