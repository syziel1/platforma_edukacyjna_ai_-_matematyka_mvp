# Edu-Future - MathematicAI - Platforma Edukacyjna AI

![Banner Projektu](https://placehold.co/1200x300/1e293b/ffffff?text=Edu-Future%20%7C%20MathematicAI)

Witaj w repozytorium projektu **Edu-Future**, innowacyjnej platformy edukacyjnej zaprojektowanej, aby zrewolucjonizować naukę matematyki poprzez personalizację, grywalizację i wsparcie sztucznej inteligencji. Projekt jest rozwijany w ramach **Bolt Hackathon**.

**Link do działającego prototypu:** [**https://edu-future.online/**](https://edu-future.online/)

---

## 🚀 O Projekcie

Edu-Future to znacznie więcej niż zbiór zadań matematycznych. Naszą misją jest stworzenie spójnej i logicznej podróży edukacyjnej, w której uczeń nie tylko rozwiązuje problemy, ale przede wszystkim rozumie **cel i sens nauki**.

Platforma opiera się na koncepcji **"Mapa wiedzy (i umiejętności)"** – interaktywnej mapy myśli, która prowadzi użytkownika przez kolejne zagadnienia matematyczne, odblokowując nowe ścieżki w miarę postępów i zapewniając, że fundamenty wiedzy są solidne.

### Główne Założenia:
* **Nauka przez Problem-Solving:** Każdy temat zaczyna się od praktycznego problemu z życia wziętego.
* **Personalizowany Mentor AI:** Każdy uczeń otrzymuje wsparcie od dedykowanego asystenta AI (obecnie opartego na Google Gemini), który pomaga, naprowadza i dostosowuje się do indywidualnego tempa nauki.
* **Grywalizacja:** Nauka odbywa się poprzez serię interaktywnych gier i wyzwań.
* **Wsparcie Ludzkich Mentorów:** Platforma w przyszłości połączy uczniów z prawdziwymi nauczycielami i korepetytorami.

---

### 🛠️ Stos Technologiczny

Na obecnym etapie MVP, projekt jest budowany z wykorzystaniem następujących technologii:

* **[React.js](https://reactjs.org/)** - Biblioteka JavaScript do budowy interfejsu użytkownika.
* **[Vite](https://vitejs.dev/)** - Narzędzie do budowania frontendu.
* **[Google Gemini API](https://ai.google.dev/)** - Silnik dla naszego inteligentnego mentora AI.
* **[Google Identity Services](https://developers.google.com/identity)** - Do autentykacji użytkowników.
* **(Backend i Baza Danych w trakcie definiowania)**

---

### 🏁 Pierwsze Kroki (Getting Started)

Aby uruchomić projekt lokalnie, postępuj zgodnie z poniższymi krokami.

#### Wymagania Wstępne

Upewnij się, że masz zainstalowany Node.js oraz npm (lub yarn).
* **npm**
    ```sh
    npm install npm@latest -g
    ```

#### Instalacja

1.  **Sklonuj repozytorium:**
    ```sh
    git clone [https://github.com/syziel1/platforma_edukacyjna_ai_-_matematyka_mvp.git](https://github.com/syziel1/platforma_edukacyjna_ai_-_matematyka_mvp.git)
    ```
2.  **Przejdź do katalogu projektu:**
    ```sh
    cd platforma_edukacyjna_ai_-_matematyka_mvp
    ```
3.  **Zainstaluj zależności:**
    ```sh
    npm install
    ```
4.  **Skonfiguruj zmienne środowiskowe:**
    Utwórz plik `.env` w głównym katalogu projektu. Następnie dodaj swoje klucze API:
    ```
    VITE_GOOGLE_CLIENT_ID="TWOJ_GOOGLE_CLIENT_ID"
    VITE_GEMINI_API_KEY="TWOJ_GEMINI_API_KEY"
    ```
5.  **Uruchom serwer deweloperski:**
    ```sh
    npm run dev
    ```
    Aplikacja będzie dostępna pod adresem `http://localhost:5173` (lub innym podanym w konsoli).

---

### 🗺️ Roadmapa (Dalszy Rozwój)

Po zakończeniu etapu MVP planujemy rozwój następujących funkcjonalności:

* [ ] Pełna implementacja interaktywnej **mapy myśli "Droga Liczb"**.
* [ ] Rozbudowa o kolejne **gry i moduły tematyczne**.
* [ ] Stworzenie **panelu dla mentora** do śledzenia postępów uczniów.
* [ ] Wdrożenie **zróżnicowanych trybów nauki** (np. "Kroczący", "Skoczek").
* [ ] Rozwój **autorskiego frameworku AI** dla jeszcze głębszej personalizacji.
* [ ] Integracja z systemem płatności i sesjami z ludzkimi nauczycielami.

---

### 🤝 Kontrybucja

Obecnie projekt jest rozwijany w ramach zamkniętego zespołu na potrzeby hackathonu. Po jego zakończeniu rozważymy otwarcie na kontrybucje zewnętrzne. Jeśli masz pomysły lub sugestie, zapraszamy do kontaktu!

---

### 🧑‍💻 Zespół

* **Sylwester Zieliński** - Wizjoner, Lider Projektu, Prototypowanie UI - [LinkedIn](https://www.linkedin.com/in/sylwekpl/)
* **Arkadiusz Słota** - Architektura Systemów, Programista AI (RAG & Gen AI)
* **Mateusz Tyburski** - Automatyzacja, Wsparcie Techniczne
* **Michał Marini** - Procesy, Analityka

---

### 📄 Licencja

Projekt jest obecnie rozwijany na zasadach poufności. Kwestie licencyjne zostaną określone w przyszłości.
