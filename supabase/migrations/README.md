# Migracje Supabase - Instrukcja

Ten folder zawiera pliki migracji SQL dla bazy danych projektu Edu-Future - MathematicAI.

## 📋 Kolejność uruchamiania migracji

Migracje muszą być uruchomione w określonej kolejności, aby zapewnić poprawne utworzenie struktury bazy danych.

### Krok 1: Utworzenie typów ENUM (WYMAGANE NAJPIERW!)

**Przed uruchomieniem jakichkolwiek migracji**, należy ręcznie utworzyć typy ENUM w bazie danych.

Wykonaj następujące zapytanie SQL przez SQL Editor w Supabase:

```sql
CREATE TYPE public.user_role AS ENUM ('admin', 'consultant', 'teacher', 'student', 'guardian');
CREATE TYPE public.event_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE public.event_type AS ENUM ('individual_lesson', 'group_lesson', 'consultation');
```

> **⚠️ WAŻNE**: Te typy muszą istnieć przed uruchomieniem pliku `00010_initial_schema.sql`, ponieważ są one używane w definicjach tabel.

### Krok 2: Główny schemat bazy danych

**Plik**: `00010_initial_schema.sql`

**Opis**: To jest główna i najważniejsza migracja. Tworzy kompletną strukturę bazy danych od zera.

**Zawartość**:
- Czyszczenie starej struktury (bezpieczne usuwanie funkcji i triggerów)
- Definicje funkcji pomocniczych:
  - `handle_updated_at()` - automatyczna aktualizacja pola `updated_at`
  - `handle_new_user()` - automatyczne tworzenie profilu użytkownika po rejestracji
  - `get_user_role(uuid)` - zwraca rolę użytkownika
  - `log_event()` - logowanie zmian w tabelach
- Tworzenie tabel:
  - `profiles` - profile użytkowników (admin, consultant, teacher, student, guardian)
  - `subjects` - przedmioty nauczania
  - `teacher_subjects` - przypisania nauczycieli do przedmiotów
  - `student_guardians` - relacje uczeń-opiekun
  - `availability_slots` - harmonogramy dostępności nauczycieli
  - `calendar_events` - wydarzenia i rezerwacje
  - `event_log` - dziennik zdarzeń (audyt)
- Triggery automatyzujące procesy
- Polityki Row Level Security (RLS) zapewniające bezpieczeństwo danych

**Instrukcja uruchomienia**:
1. Skopiuj zawartość pliku
2. W panelu Supabase → SQL Editor → New Query
3. Wklej zawartość i kliknij "Run"

### Krok 3: Funkcja dostępności slotów

**Plik**: `0006_create_availability_function.sql`

**Opis**: Dodaje funkcję `get_available_time_slots`, która oblicza dostępne terminy dla nauczycieli.

**Zawartość**:
- Funkcja `get_available_time_slots(teacher_id, target_date, slot_duration_minutes)`
- Zwraca listę dostępnych okienek czasowych
- Uwzględnia harmonogram nauczyciela i już istniejące rezerwacje

**Parametry funkcji**:
- `p_teacher_id` (uuid) - ID nauczyciela
- `p_target_date` (date) - data, dla której sprawdzamy dostępność
- `p_slot_duration_minutes` (integer) - długość slotu w minutach (domyślnie 60)

**Przykład użycia**:
```sql
-- Pobierz dostępne sloty dla nauczyciela na 15 stycznia 2024, po 60 minut
SELECT * FROM get_available_time_slots(
  'teacher-uuid-here',
  '2024-01-15',
  60
);
```

**Instrukcja uruchomienia**:
1. Skopiuj zawartość pliku
2. W panelu Supabase → SQL Editor → New Query
3. Wklej zawartość i kliknij "Run"

## 🔢 Numeracja plików migracji

Pliki migracji są ponumerowane zgodnie z konwencją:

- `00010_initial_schema.sql` - Główny schemat (numer 10 wskazuje na kluczową migrację bazową)
- `0006_create_availability_function.sql` - Funkcja dostępności (niższy numer, ale uruchamiana po głównym schemacie)

> **💡 Uwaga**: Pomimo numeracji, kolejność uruchamiania jest określona w tej dokumentacji (nie według numerów plików). Zawsze najpierw ENUM, potem schemat główny, następnie dodatkowe funkcje.

## 🛠️ Metoda automatyczna z Supabase CLI

Jeśli wolisz zautomatyzować proces, możesz użyć Supabase CLI:

```bash
# 1. Najpierw ręcznie utwórz typy ENUM przez SQL Editor
# (Zobacz dokumentację w docs/SUPABASE_SETUP.md)

# 2. Zaloguj się i połącz z projektem
supabase login
supabase link --project-ref twoj-project-ref

# 3. Wypchnij wszystkie migracje
supabase db push

# 4. Sprawdź status migracji
supabase migration list
```

## 📝 Dodawanie nowych migracji

Jeśli w przyszłości będziesz dodawać nowe migracje:

1. Utwórz nowy plik z odpowiednią numeracją:
   ```
   XXXXX_opis_migracji.sql
   ```
   gdzie `XXXXX` to numer większy od ostatniej migracji

2. Dodaj opis migracji na początku pliku:
   ```sql
   /*
    * Migracja: Opis zmian
    * Data: YYYY-MM-DD
    * Autor: Imię Nazwisko
    *
    * Co zmienia ta migracja:
    * - Zmiana 1
    * - Zmiana 2
    */
   ```

3. Zaktualizuj ten plik README.md, dodając nową migrację do listy

4. Przetestuj migrację lokalnie przed wdrożeniem na produkcję

## 🗑️ Uwaga o folderze `.bolt/supabase_discarded_migrations`

W katalogu `.bolt/supabase_discarded_migrations/` znajdują się stare, nieużywane pliki migracji. 

**Nie używaj tych plików!** Zostały one zastąpione przez:
- `00010_initial_schema.sql` - który konsoliduje wszystkie poprzednie migracje

Folder ten jest zachowany jedynie dla celów historycznych i może zostać usunięty w przyszłości.

## ✅ Weryfikacja poprawności migracji

Po uruchomieniu wszystkich migracji, sprawdź poprawność wykonując:

```sql
-- Sprawdź typy ENUM
SELECT typname FROM pg_type WHERE typname IN ('user_role', 'event_status', 'event_type');
-- Oczekiwane: 3 wyniki

-- Sprawdź tabele
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
-- Oczekiwane: 7 tabel

-- Sprawdź funkcje
SELECT routine_name FROM information_schema.routines 
WHERE routine_schema = 'public' 
ORDER BY routine_name;
-- Oczekiwane: 5 funkcji
```

## 📚 Dodatkowe informacje

Szczegółową instrukcję konfiguracji Supabase znajdziesz w pliku:
**[docs/SUPABASE_SETUP.md](../../docs/SUPABASE_SETUP.md)**

W razie problemów, zajrzyj do sekcji **Troubleshooting** w powyższym dokumencie.

---

**Ostatnia aktualizacja**: 2024-12-15
**Wersja schematu**: 1.0
