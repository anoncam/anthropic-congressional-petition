# Petition Your Representatives

A web application that helps US citizens generate personalized petition letters to their members of Congress regarding the Department of War's February 2026 actions against Anthropic.

**Live at:** [petition-app-omega.vercel.app](https://petition-app-omega.vercel.app)

## Background

In February 2026, the Department of War (formerly the Department of Defense) issued an ultimatum to Anthropic demanding the removal of safety guardrails from its AI models to enable:

1. **Fully autonomous weapons** — lethal systems that kill without human oversight
2. **Mass domestic surveillance** — AI-powered monitoring of US citizens at scale

Anthropic refused both demands. The administration retaliated by:

- Ordering all federal agencies to stop using Anthropic products
- Designating Anthropic a "supply chain risk," blacklisting it from military and contractor work
- Removing Anthropic from GSA procurement
- Awarding replacement contracts to competitors willing to comply

These actions raise urgent questions about executive overreach, the future of AI safety, and Congress's constitutional duty to oversee the Department of War. This tool helps citizens exercise their First Amendment right to petition their elected representatives for redress.

### Source Reporting

- [Anthropic's Official Statement](https://www.anthropic.com/news/statement-department-of-war)
- [NPR — Anthropic Refuses Pentagon Demand](https://www.npr.org/2026/02/26/nx-s1-5727847/anthropic-defense-hegseth-ai-weapons-surveillance)
- [NPR — Trump Orders Agencies to Drop Anthropic](https://www.npr.org/2026/02/27/nx-s1-5729118/trump-anthropic-pentagon-openai-ai-weapons-ban)
- [US News — What to Know About the Clash](https://www.usnews.com/news/technology/articles/2026-02-28/what-to-know-about-the-clash-between-the-pentagon-and-anthropic-over-militarys-ai-use)
- [Lawfare — The Pentagon Goes to War With Anthropic](https://www.lawfaremedia.org/article/scaling-laws--the-pentagon-goes-to-war-with-anthropic)
- [Bulletin of the Atomic Scientists — Life or Death for All of Us](https://thebulletin.org/2026/02/anthropics-showdown-with-the-us-department-of-war-may-literally-mean-life-or-death-for-all-of-us/)
- [Center for American Progress — Making an Example of Anthropic](https://www.americanprogress.org/article/the-trump-administration-is-trying-to-make-an-example-of-the-ai-giant-anthropic/)

## How It Works

1. User enters their name, mailing address, and personal concerns
2. The app looks up their congressional representatives (1 House member + 2 Senators) using their address
3. Claude generates a unique, tailored petition letter for each representative
4. The app provides the full letter text (printable/copyable) along with mailing instructions, office addresses, and follow-up tips

No account required. No data stored. Fully stateless.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) |
| Petition Generation | [Claude API](https://docs.anthropic.com/en/api) via `@anthropic-ai/sdk` |
| Address → District Lookup | [Geocodio API](https://www.geocod.io/) |
| Hosting | [Vercel](https://vercel.com/) |

## Contributing

### Prerequisites

- Node.js 20+
- npm
- A [Geocodio API key](https://dash.geocod.io/register) (free tier: 2,500 lookups/day)
- An [Anthropic API key](https://console.anthropic.com/)

### Setup

```bash
git clone https://github.com/anoncam/anthropic-congressional-petition.git
cd anthropic-congressional-petition/petition-app
npm install
```

Create a `.env.local` file (see `.env.local.example`):

```
ANTHROPIC_API_KEY=your-anthropic-api-key
GEOCODIO_API_KEY=your-geocodio-api-key
```

### Development

```bash
npm run dev        # Start dev server at http://localhost:3000
npm run build      # Production build
npm run lint       # Run ESLint
```

### Project Structure

```
petition-app/
├── app/
│   ├── page.tsx                        # Main page — form, loading, results states
│   ├── layout.tsx                      # Root layout, fonts, metadata
│   ├── globals.css                     # Tailwind config, theme tokens, print styles
│   └── api/
│       ├── representatives/route.ts    # POST: address → representative list (Geocodio)
│       └── generate-petition/route.ts  # POST: user data + reps → petition letters (Claude)
├── components/
│   ├── PetitionForm.tsx                # Input form with concern suggestions
│   └── PetitionDisplay.tsx             # Letter display with copy, print, mailing info
├── lib/
│   ├── types.ts                        # Shared TypeScript interfaces
│   ├── geocodio.ts                     # Geocodio API client
│   └── claude.ts                       # Claude API petition generation + prompts
└── .env.local.example                  # Required environment variables
```

### Areas for Contribution

- **Committee data enrichment** — Currently representatives are returned without committee assignments. Integrating the [congress.gov API](https://api.congress.gov/) or the [unitedstates/congress-legislators](https://github.com/unitedstates/congress-legislators) dataset would allow the petition prompt to reference specific oversight roles.
- **Additional petition targets** — Beyond local reps, surface members of Armed Services, Intelligence, Oversight, and Judiciary committees as optional recipients.
- **PDF export** — Generate downloadable, print-ready PDFs with proper letter formatting.
- **Accessibility** — Audit and improve keyboard navigation, screen reader support, and color contrast.
- **Internationalization** — Support for territories (PR, GU, VI, AS, MP) where representative structures differ.
- **Rate limiting** — Add client-side throttling to prevent abuse of the Geocodio and Claude APIs.
- **Testing** — Unit tests for API routes and component tests for the form/display flow.

### Guidelines

- Keep it stateless — no databases, no user accounts, no tracking
- Petition content should be factual and grounded in documented reporting
- The tool is nonpartisan — it facilitates constituent-to-representative communication regardless of party
- Prioritize accessibility and print-friendliness
- Don't commit `.env.local` or any API keys

## License

MIT
