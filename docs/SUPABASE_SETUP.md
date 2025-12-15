# Instrukcja konfiguracji Supabase

Ten dokument opisuje jak odtworzyć bazę danych Supabase od zera dla projektu Edu-Future - MathematicAI.

## Spis treści

1. [Tworzenie nowego projektu Supabase](#1-tworzenie-nowego-projektu-supabase)
2. [Kopiowanie danych uwierzytelniających](#2-kopiowanie-danych-uwierzytelniających)
3. [Aktualizacja pliku .env](#3-aktualizacja-pliku-env)
4. [Tworzenie typów ENUM](#4-tworzenie-typów-enum)
5. [Uruchomienie głównej migracji](#5-uruchomienie-głównej-migracji)
6. [Dodanie funkcji dostępności slotów](#6-dodanie-funkcji-dostępności-slotów)
7. [Alternatywna metoda z Supabase CLI](#7-alternatywna-metoda-z-supabase-cli)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. Tworzenie nowego projektu Supabase

1. Wejdź na [supabase.com](https://supabase.com)
2. Zaloguj się do swojego konta (lub utwórz nowe konto)
3. Kliknij przycisk **"New Project"** (Nowy Projekt)
4. Wypełnij formularz tworzenia projektu:
   - **Name** (Nazwa): Wybierz nazwę dla projektu, np. `edu-future-db`
   - **Database Password** (Hasło bazy danych): Utwórz silne hasło (zapisz je w bezpiecznym miejscu!)
   - **Region** (Region): Wybierz region najbliższy Twojej lokalizacji (dla Polski zalecany: `Europe (Frankfurt)` lub `Europe (London)`)
   - **Pricing Plan** (Plan cenowy): Wybierz plan (Free tier jest wystarczający do rozpoczęcia)
5. Kliknij **"Create new project"** (Utwórz nowy projekt)
6. Poczekaj kilka minut, aż Supabase przygotuje infrastrukturę

---

## 2. Kopiowanie danych uwierzytelniających

Po utworzeniu projektu musisz skopiować dane uwierzytelniające:

1. W panelu Supabase przejdź do **Settings** (Ustawienia) → **API**
2. Znajdź i skopiuj następujące wartości:
   - **Project URL** (URL projektu): 
     - Znajduje się w sekcji "Project URL"
     - Przykład: `https://abcdefghijklmnop.supabase.co`
     - Ta wartość będzie używana jako `VITE_SUPABASE_URL`
   
   - **anon/public key** (Klucz publiczny):
     - Znajduje się w sekcji "Project API keys"
     - Szukaj klucza oznaczonego jako `anon` lub `public`
     - Jest to długi ciąg znaków rozpoczynający się od `eyJ...`
     - Ta wartość będzie używana jako `VITE_SUPABASE_ANON_KEY`

> **⚠️ WAŻNE**: Nigdy nie udostępniaj klucza `service_role` publicznie! Używaj tylko klucza `anon` w aplikacji frontendowej.

---

## 3. Aktualizacja pliku `.env`

1. W głównym katalogu projektu znajdź plik `.env.example`
2. Utwórz kopię tego pliku i nazwij ją `.env`:
   ```bash
   cp .env.example .env
   ```
3. Otwórz plik `.env` w edytorze tekstu
4. Uzupełnij skopiowane wcześniej wartości:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://twoj-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=twoj-anon-key-tutaj

# Secure Proxy URL (for API calls like ElevenLabs TTS)
VITE_SECURE_PROXY_URL=

# Pozostałe zmienne środowiskowe (jeśli wymagane)
VITE_GOOGLE_CLIENT_ID=
VITE_GEMINI_API_KEY=
```

5. Zapisz plik `.env`

> **💡 Wskazówka**: Plik `.env` jest ignorowany przez git (znajduje się w `.gitignore`), więc Twoje klucze pozostaną bezpieczne i nie zostaną przypadkowo wysłane do repozytorium.

---

## 4. Tworzenie typów ENUM

**WAŻNE**: Typy ENUM muszą być utworzone **PRZED** uruchomieniem głównej migracji!

### Metoda 1: Przez SQL Editor w Supabase (zalecana dla początkujących)

1. W panelu Supabase przejdź do zakładki **SQL Editor**
2. Kliknij **"New Query"** (Nowe zapytanie)
3. Skopiuj i wklej następujący kod SQL:

```sql
-- Tworzenie typów ENUM dla projektu Edu-Future
CREATE TYPE public.user_role AS ENUM ('admin', 'consultant', 'teacher', 'student', 'guardian');
CREATE TYPE public.event_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE public.event_type AS ENUM ('individual_lesson', 'group_lesson', 'consultation');
```

4. Kliknij **"Run"** (Uruchom), aby wykonać zapytanie
5. Upewnij się, że zapytanie zakończyło się sukcesem (komunikat: "Success. No rows returned")

### Metoda 2: Przez Supabase CLI

```bash
# Zaloguj się do Supabase CLI
supabase login

# Połącz się z projektem
supabase link --project-ref twoj-project-ref

# Wykonaj zapytanie SQL
supabase db execute --file supabase/migrations/create_enums.sql
```

> **📝 Uwaga**: Plik głównej migracji `00010_initial_schema.sql` ma zakomentowane linijki tworzenia typów ENUM (linie 31-33), ponieważ zakładamy, że zostały one już utworzone w tym kroku.

---

## 5. Uruchomienie głównej migracji

Po utworzeniu typów ENUM możesz uruchomić główną migrację, która tworzy całą strukturę bazy danych.

### Metoda 1: Przez SQL Editor w Supabase

1. Otwórz plik `supabase/migrations/00010_initial_schema.sql` w edytorze tekstu
2. Skopiuj całą zawartość pliku
3. W panelu Supabase przejdź do zakładki **SQL Editor**
4. Kliknij **"New Query"**
5. Wklej skopiowaną zawartość
6. Kliknij **"Run"**
7. Poczekaj na zakończenie wykonywania (może potrwać kilka sekund)

### Czego dokona ta migracja?

Migracja `00010_initial_schema.sql` tworzy:
- ✅ Funkcje pomocnicze (`handle_updated_at`, `handle_new_user`, `get_user_role`, `log_event`)
- ✅ Tabele: `profiles`, `subjects`, `teacher_subjects`, `student_guardians`, `availability_slots`, `calendar_events`, `event_log`
- ✅ Triggery automatyzujące procesy (np. automatyczne tworzenie profilu po rejestracji użytkownika)
- ✅ Polityki Row Level Security (RLS) zapewniające bezpieczeństwo danych
- ✅ Ograniczenia integralności danych (constraints)

---

## 6. Dodanie funkcji dostępności slotów

Po uruchomieniu głównej migracji należy dodać funkcję, która oblicza dostępne terminy dla nauczycieli.

### Przez SQL Editor w Supabase

1. Otwórz plik `supabase/migrations/0006_create_availability_function.sql`
2. Skopiuj całą zawartość pliku
3. W panelu Supabase przejdź do zakładki **SQL Editor**
4. Kliknij **"New Query"**
5. Wklej skopiowaną zawartość
6. Kliknij **"Run"**

### Co robi ta funkcja?

Funkcja `get_available_time_slots`:
- Przyjmuje jako parametry: ID nauczyciela, datę docelową i długość slotu (domyślnie 60 minut)
- Zwraca listę dostępnych okienek czasowych
- Uwzględnia harmonogram nauczyciela (`availability_slots`)
- Wyklucza już zarezerwowane terminy (`calendar_events` ze statusem `confirmed`)

---

## 7. Alternatywna metoda z Supabase CLI

Jeśli wolisz używać wiersza poleceń, możesz zautomatyzować cały proces przy użyciu Supabase CLI.

### Instalacja Supabase CLI

```bash
# macOS (Homebrew)
brew install supabase/tap/supabase

# Windows (Scoop)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Linux
brew install supabase/tap/supabase
# lub pobierz binary z: https://github.com/supabase/cli/releases
```

### Konfiguracja i uruchomienie migracji

```bash
# 1. Zaloguj się do Supabase
supabase login

# 2. Połącz lokalny projekt z projektem w chmurze
# Project ref znajdziesz w: Settings → General → Reference ID
supabase link --project-ref twoj-project-ref

# 3. Najpierw ręcznie utwórz typy ENUM przez SQL Editor
# (Zobacz sekcja 4 powyżej)

# 4. Wypchnij migracje do bazy danych
supabase db push

# Opcjonalnie: Zobacz status migracji
supabase migration list
```

### Zalety używania Supabase CLI:

- ✅ Automatyczna synchronizacja migracji
- ✅ Zarządzanie wersjami schematu
- ✅ Możliwość pracy lokalnej z bazą danych
- ✅ Łatwiejsze testowanie zmian przed wdrożeniem

---

## 8. Troubleshooting

### Problem: Baza danych została wyłączona po długiej nieaktywności

**Objawy**: 
- Nie można połączyć się z bazą danych
- Komunikat błędu: "Project is paused" lub "Database is inactive"

**Rozwiązanie**:
1. Zaloguj się do panelu Supabase
2. Przejdź do swojego projektu
3. Znajdź komunikat o wstrzymaniu projektu
4. Kliknij przycisk **"Restore project"** lub **"Resume project"**
5. Poczekaj kilka minut na ponowne uruchomienie infrastruktury
6. Po wznowieniu sprawdź, czy dane zostały zachowane
7. Jeśli baza danych jest pusta, uruchom ponownie wszystkie migracje (kroki 4-6)

### Problem: Błąd "type user_role does not exist" podczas migracji

**Przyczyna**: Typy ENUM nie zostały utworzone przed główną migracją.

**Rozwiązanie**:
1. Wykonaj krok 4 (Tworzenie typów ENUM)
2. Następnie ponownie uruchom główną migrację (krok 5)

### Problem: Błąd "relation already exists"

**Przyczyna**: Próba ponownego utworzenia już istniejącej tabeli lub funkcji.

**Rozwiązanie**:
1. Sprawdź, które obiekty już istnieją:
   ```sql
   -- Lista tabel
   SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
   
   -- Lista funkcji
   SELECT routine_name FROM information_schema.routines WHERE routine_schema = 'public';
   ```
2. Jeśli obiekt już istnieje, pomiń ten krok lub usuń obiekt przed ponownym utworzeniem:
   ```sql
   DROP TABLE IF EXISTS nazwa_tabeli CASCADE;
   DROP FUNCTION IF EXISTS nazwa_funkcji CASCADE;
   ```

### Problem: Nie mogę zalogować użytkownika lub RLS blokuje dostęp

**Przyczyna**: Polityki Row Level Security (RLS) mogą być zbyt restrykcyjne lub nie ma odpowiedniego profilu użytkownika.

**Rozwiązanie**:
1. Sprawdź, czy profil użytkownika został utworzony:
   ```sql
   SELECT * FROM public.profiles WHERE id = 'user-uuid';
   ```
2. Sprawdź polityki RLS:
   ```sql
   SELECT * FROM pg_policies WHERE schemaname = 'public';
   ```
3. Upewnij się, że trigger `on_auth_user_created` działa poprawnie
4. W razie problemów, tymczasowo wyłącz RLS dla tabeli (tylko do debugowania!):
   ```sql
   ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
   ```

### Problem: Funkcja get_available_time_slots nie zwraca wyników

**Przyczyna**: Brak danych w tabeli `availability_slots` lub niepoprawne parametry.

**Rozwiązanie**:
1. Sprawdź, czy nauczyciel ma zdefiniowaną dostępność:
   ```sql
   SELECT * FROM public.availability_slots WHERE teacher_id = 'teacher-uuid';
   ```
2. Dodaj przykładową dostępność (np. poniedziałek 9:00-17:00):
   ```sql
   INSERT INTO public.availability_slots (teacher_id, day_of_week, start_time, end_time)
   VALUES ('teacher-uuid', 1, '09:00:00', '17:00:00');
   ```
3. Przetestuj funkcję:
   ```sql
   SELECT * FROM get_available_time_slots('teacher-uuid', '2024-01-15', 60);
   ```

### Weryfikacja poprawności migracji

Aby upewnić się, że wszystkie migracje zostały poprawnie zastosowane, wykonaj następujące sprawdzenia:

```sql
-- 1. Sprawdź typy ENUM
SELECT typname FROM pg_type WHERE typname IN ('user_role', 'event_status', 'event_type');

-- 2. Sprawdź tabele
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 3. Sprawdź funkcje
SELECT routine_name FROM information_schema.routines 
WHERE routine_schema = 'public' 
ORDER BY routine_name;

-- 4. Sprawdź polityki RLS
SELECT tablename, policyname FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;
```

Powinieneś zobaczyć:
- ✅ 3 typy ENUM: `user_role`, `event_status`, `event_type`
- ✅ 7 tabel: `profiles`, `subjects`, `teacher_subjects`, `student_guardians`, `availability_slots`, `calendar_events`, `event_log`
- ✅ 5 funkcji: `handle_updated_at`, `handle_new_user`, `get_user_role`, `log_event`, `get_available_time_slots`
- ✅ Wiele polityk RLS dla każdej tabeli

---

## Dodatkowe zasoby

- [Oficjalna dokumentacja Supabase](https://supabase.com/docs)
- [Supabase CLI - dokumentacja](https://supabase.com/docs/reference/cli)
- [Row Level Security (RLS) - przewodnik](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL ENUM types](https://www.postgresql.org/docs/current/datatype-enum.html)

---

## Kontakt i wsparcie

W razie problemów lub pytań dotyczących konfiguracji bazy danych, skontaktuj się z zespołem rozwojowym projektu Edu-Future.

**Zespół**: Sylwester Zieliński, Arkadiusz Słota, Mateusz Tyburski, Michał Marini
