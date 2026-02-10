# Soanki

Automate your Anki vocab decks: generate flashcards with AI (Gemini), images, and audio. Supports English, German, and Arabic with RTL.

## Project structure

```
├── app/
│   ├── [locale]/           # Locale-based routes (en, de, ar)
│   │   ├── layout.tsx      # Layout, fonts, Navbar, Footer
│   │   ├── page.tsx        # Home
│   │   ├── generator/      # Deck generator page
│   │   └── globals.css
│   └── api/
│       └── generate-deck/  # POST: generate deck via Gemini
├── components/
│   ├── features/          # Feature-specific UI
│   │   ├── home/           # Landing sections (Hero, Process, etc.)
│   │   └── generator/      # Generator (Stepper, cards, view)
│   ├── layout/             # Navbar, Footer
│   └── ui/                 # Shared UI (Button, Dropdown)
├── i18n/                   # next-intl routing & navigation
├── lib/
│   ├── deck/               # Deck generation (Gemini prompt, parser, types)
│   └── utils.ts
├── messages/               # en.json, de.json, ar.json
└── public/
```

- **API**: `app/api/*` — thin handlers; business logic in `lib/`.
- **Deck generation**: Prompt, parser, and Gemini call in `lib/deck/`; route only parses request and returns JSON.
- **Features**: `components/features/<name>/` — one folder per feature (home, generator).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000). For the deck generator use `/en/generator` (or `/de`, `/ar`).

**Environment:** Copy `.env.example` to `.env.local` and set `GEMINI_API_KEY` ([Google AI Studio](https://aistudio.google.com/apikey)) for the generate-deck API.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
