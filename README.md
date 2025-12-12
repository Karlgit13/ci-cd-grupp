# Meetup App - CI/CD Grupparbete

Detta repository innehåller koden för mitt grupparbete inom CI/CD. Projektet är en fullstack-applikation utvecklad för att skapa och hantera meetups.

## Så fungerar det

Applikationen är uppdelad i två huvuddelar:

- **Frontend**: En React-baserad webbapplikation där användare kan registrera sig, logga in och se     tillgängliga meetups. Här går det också att anmäla sig till event och lämna recensioner.
- **Backend**: Ett REST-API byggt med Node.js och Express. Det hanterar all affärslogik, autentisering och kommunikation med vår PostgreSQL-databas.

Jag använder **GitHub Actions** för att automatisera våra byggen och tester. Vid varje push till `main`-branchen körs en pipeline som säkerställer att koden fungerar som den ska och bygger Docker-images.

## Teknisk översikt

*   **Språk & Ramverk:** JavaScript, React, Node.js, Express
*   **Databas:** PostgreSQL i Render
*   **Infrastruktur:** Docker, GitHub Actions

## Kör projektet lokalt

För att köra igång applikationen på din egen dator:

1.  **Installera beroenden:**
    Jag använder `pnpm` för pakethantering. Stå i roten av projektet och kör:
    ```bash
    pnpm install
    ```

2.  **Starta backend:**
    Navigera till backend-mappen och starta servern.
    ```bash
    cd backend
    npm run dev 
    ```

3.  **Starta frontend:**
    Öppna en ny terminal, gå in i frontend-mappen och dra igång klienten.
    ```bash
    cd frontend
    npm start
    ```

Se till att du har konfigurerat dina miljövariabler (t.ex. databas-URL) i en `.env`-fil innan du startar.
