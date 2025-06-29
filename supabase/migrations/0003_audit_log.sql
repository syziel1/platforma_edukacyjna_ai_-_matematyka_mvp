/*
 * KROK 4: DZIENNIK ZDARZEŃ (ŚLAD AUDYTOWY) - (Wersja 2)
 *
 * NAPRAWIONO BŁĄD: Włączono RLS.
 * NAPRAWIONO OSTRZEŻENIE: Dodano SET search_path do funkcji.
 */

CREATE TABLE public.event_log (
  id bigserial PRIMARY KEY,
  timestamp timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  table_name text,
  record_id text,
  details jsonb
);
COMMENT ON TABLE public.event_log IS 'Rejestr wszystkich zdarzeń w systemie do celów audytowych.';

-- WŁĄCZENIE RLS
ALTER TABLE public.event_log ENABLE ROW LEVEL SECURITY;
-- Polityka: Tylko admini i konsultanci mają dostęp do logów.
CREATE POLICY "Admini i konsultanci mogą przeglądać logi zdarzeń"
  ON public.event_log FOR SELECT
  USING ( get_user_role((SELECT auth.uid())) IN ('admin', 'consultant') );


-- Funkcja do logowania zdarzeń (z poprawką bezpieczeństwa)
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

-- Triggery (bez zmian)
CREATE TRIGGER log_profiles_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.log_event();
CREATE TRIGGER log_calendar_events_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.calendar_events
  FOR EACH ROW EXECUTE FUNCTION public.log_event();