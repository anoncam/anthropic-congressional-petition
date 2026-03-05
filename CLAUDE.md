# Congressional Petition App

A civic engagement tool that helps US citizens generate personalized petition letters to their congressional representatives about the DoW/Anthropic AI safety dispute (February 2026).

## Tech Stack
- **Framework**: Next.js 15 (App Router) + TypeScript + React 19
- **Styling**: Tailwind CSS 4
- **AI**: Anthropic Claude API (`claude-opus-4-6`) via `@anthropic-ai/sdk`
- **Address/Rep Lookup**: Geocodio API
- **Hosting**: Vercel (live at https://petition.usa.dev)

## Key Files
- `petition-app/lib/claude.ts` — System prompt, `buildPrompt()`, petition generation
- `petition-app/lib/geocodio.ts` — Representative lookup by address
- `petition-app/lib/types.ts` — All shared TypeScript interfaces
- `petition-app/app/api/representatives/route.ts` — POST: address → representatives
- `petition-app/app/api/generate-petition/route.ts` — POST: user + reps → letters
- `petition-app/components/PetitionForm.tsx` — 5-step form wizard
- `petition-app/components/PetitionDisplay.tsx` — Letter display + mailing instructions

## Environment Variables
```
ANTHROPIC_API_KEY=
GEOCODIO_API_KEY=
```
Copy `.env.local.example` to `.env.local` to get started.

## Available Agents
Use `/agents` to invoke specialized agents for this codebase:

| Agent | When to use |
|---|---|
| `petition-prompt-engineer` | Improving letter quality, tone instructions, prompt structure |
| `frontend-reviewer` | React components, Tailwind, accessibility, print styles |
| `api-debugger` | API route issues, representative lookup, petition generation errors |
| `issue-investigator` | Diagnosing a GitHub issue without implementing a fix |
| `content-guardian` | Updating verified facts and news sources as events develop |

## Architecture Notes
- Fully stateless — no database, no user data stored
- Letters are generated in parallel via `Promise.all()` (one per representative)
- Each address returns 3 representatives: 1 House member + 2 Senators
- Print styles in `globals.css` are critical — letters must print cleanly
