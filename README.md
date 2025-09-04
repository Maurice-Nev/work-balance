# Work Balance - README

## Projektübersicht

Work Balance ist eine Webanwendung zur Erfassung und Analyse von Stressleveln am Arbeitsplatz. Mitarbeitende können anonym ihr Stresslevel erfassen und Bewertungen abgeben. Administratoren können die gesammelten Daten visualisieren und auswerten, um Maßnahmen zur Verbesserung des Arbeitsumfelds abzuleiten.

### Features

- Anonyme Stresslevel-Erfassung
- Dashboard mit Stress- und Kommentarübersicht
- Benutzer- und Rollenverwaltung
- Abteilungsanalysen
- Kommentar- und Feedbackverwaltung
- Statistiken und Diagramme

## Installation und Setup

### Voraussetzungen

- Node.js (>= 18.x)
- npm (>= 9.x)
- Supabase CLI
- docker

### Installationsanleitung

1. Repository klonen:

   ```bash
   git clone https://github.com/Maurice-Nev/work-balance.git
   cd work-balance
   ```

2. Abhängigkeiten installieren:

   ```bash
   npm install
   ```

3. Umgebungsvariablen konfigurieren:

   - Erstellen Sie eine `.env.local` Datei im Stammverzeichnis und füllen Sie die Umgebungsvariablen basierend auf `example.env.local`.

4. Supabase einrichten:

   ```bash
   supabase start
   ```

   - Seed-Daten laden:
     ```bash
     supabase db seed
     ```

5. Entwicklung starten:
   ```bash
   npm run dev
   ```

## Nutzung

- Öffnen Sie die Anwendung im Browser unter `http://localhost:3000`.
- Melden Sie sich mit einem bestehenden Benutzerkonto an oder registrieren Sie sich als neuer Benutzer.
- Navigieren Sie über das Dashboard zu den gewünschten Funktionen.

## Tests

- Unit-Tests ausführen:
  ```bash
  npm run test
  ```
- Stresstests:
  ```bash
  npm run stresstest
  ```

## Deployment

- Produktion bauen:
  ```bash
  npm run build
  ```
- Server starten:
  ```bash
  npm run start
  ```

## Lizenz

Dieses Projekt steht unter der MIT-Lizenz.
