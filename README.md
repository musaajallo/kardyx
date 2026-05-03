# Kardyx

> The cards in your hand are the interface. The game lives in the engine.

Kardyx is a hybrid card gaming ecosystem — physical decks become the interface for a digital engine. Scan a card with your phone, trigger a Power-Up, play with friends online or on your local network.

## Status

**Phase 0 — Brand exploration:** Locked (Atlas × Quiet Game hybrid, awaiting client logo)
**Phase 1 — Foundation:** In progress (this monorepo)

See [`docs/`](./docs/README.md) for the complete spec — concept, architecture, brand, deployment, auth, payments, offline strategy, roadmap.

## Stack

- **Monorepo:** Turborepo + pnpm + TypeScript
- **Web:** Next.js 16 → Vercel
- **Mobile:** React Native (Expo) → EAS
- **API:** Fastify (Node 22) in Docker → Railway
- **Realtime:** Socket.io + Redis adapter
- **CV:** TFLite (mobile) + TF.js (web PWA)
- **Data:** PostgreSQL + Redis (Railway-managed) + Cloudflare R2
- **Auth:** Lucia self-hosted, Argon2id, TOTP 2FA
- **Payments:** Waychit, Modern Pay, GamSwitch (Phase 1)
- **Styling:** NativeWind so Tailwind classes render identically on web + mobile

## Project Layout

```
kardyx/
├── apps/
│   ├── web/        # Next.js 16
│   ├── mobile/     # React Native (Expo)
│   └── api/        # Fastify (Docker)
├── packages/
│   ├── tokens/     # Design tokens (Style Dictionary)
│   ├── ui/         # Shared components (NativeWind + shadcn)
│   ├── game-engine/# Pure-TS Power-Up state machine
│   ├── types/      # Shared API + game state types
│   ├── auth/       # Lucia + TOTP 2FA
│   ├── payments/   # Mobile money provider abstraction
│   └── cv/         # Card recognition (TFLite + TF.js)
├── infra/
│   ├── docker/     # API Dockerfile + compose
│   └── railway/    # Railway deployment config
└── docs/           # Full project documentation
```

## Local Development

### Prerequisites

- Node 22 (`nvm use` reads `.nvmrc`)
- pnpm 9 (`npm i -g pnpm`)
- Docker + Docker Compose

### First-time setup

```bash
pnpm install
pnpm tokens:build      # generate Tailwind/NativeWind/Figma outputs from brand tokens
```

### Run the API + Postgres + Redis locally

```bash
pnpm infra:up          # docker compose up: api + postgres + redis + mailhog
```

### Run the web app

```bash
pnpm web:dev           # http://localhost:3000
```

### Run the mobile app

```bash
pnpm mobile:dev        # opens Expo dev tools
```

### Run everything in parallel

```bash
pnpm dev               # turbo runs all dev tasks
```

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Run all dev servers via Turbo |
| `pnpm build` | Build all packages and apps |
| `pnpm lint` | Lint all workspaces |
| `pnpm typecheck` | TypeScript check all workspaces |
| `pnpm test` | Run all tests |
| `pnpm tokens:build` | Generate platform outputs from `packages/tokens/src/tokens.json` |
| `pnpm infra:up` / `infra:down` | Local Docker stack |
| `pnpm format` | Prettier-format the repo |

## Deployment Map

| Component | Host |
|---|---|
| `apps/web` | Vercel (auto from `main`) |
| `apps/api` | Railway (Docker, auto from `main`) |
| `apps/mobile` | Expo EAS (`eas build` + `eas update`) |
| Postgres + Redis | Railway-managed |
| Object storage | Cloudflare R2 |

See [`docs/08-deployment.md`](./docs/08-deployment.md) for full deployment details.

## License

UNLICENSED — all rights reserved. See [`docs/05-legal.md`](./docs/05-legal.md) for IP strategy.
