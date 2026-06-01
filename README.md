# Hoe digitaal ben jij? — Gemeente Kampen

Een moderne, anonieme digitale zelftest voor medewerkers, met een dashboard voor het innovatieteam.

## Tech stack

- **Next.js** (App Router)
- **Tailwind CSS**
- **Lucide React**
- **Firebase Firestore**
- **Recharts**
- Deploy op **Vercel**

## Lokaal starten

1. Installeer dependencies:

```bash
npm install
```

2. Kopieer `.env.example` naar `.env.local` en vul je Firebase-configuratie in:

```bash
cp .env.example .env.local
```

3. Start de development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Firebase

1. Maak een Firebase-project aan op [console.firebase.google.com](https://console.firebase.google.com).
2. Voeg een web-app toe en kopieer de configuratie naar `.env.local`.
3. Maak Firestore aan in **test mode** (of stel security rules in die anoniem schrijven toestaan voor `survey_results`).
4. Collectie: `survey_results` met velden:
   - `timestamp`
   - `theme_1_score`
   - `theme_2_score`
   - `total_score`
   - `profile` (`De Digitale Verkenner` | `De Digitale Doorpakker` | `De Digitale Pionier`)

## Pagina's

| Route | Beschrijving |
|-------|--------------|
| `/` | Landingspagina |
| `/test` | Stap-voor-stap enquête (6 vragen) |
| `/resultaat` | Persoonlijk profiel + delen |
| `/dashboard` | Geaggregeerde resultaten |

## Deploy op Vercel

1. Push naar GitHub.
2. Importeer het project in Vercel.
3. Voeg de `NEXT_PUBLIC_FIREBASE_*` environment variables toe.
4. Deploy.
