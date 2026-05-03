# Kardyx Documentation

The Hybrid Card Gaming Ecosystem — a Living Card Game (LCG) platform that bridges physical card play with a dynamic digital engine.

## Document Index

1. [Concept Note](01-concept.md) — Vision, MVP scope, and core experience
2. [Architecture](02-architecture.md) — Stack, monorepo, services, data flow
3. [Power-Up Vault](03-power-ups.md) — Catalog of digital card abilities
4. [Platform Features](04-features.md) — Accounts, parties, modes, designer
5. [Legal & IP](05-legal.md) — Trademark, copyright, patent strategy
6. [Roadmap](06-roadmap.md) — Phased delivery plan to MVP and beyond
7. [Brand Strategy](07-brand.md) — Design system, tokens, voice, character IP
   - [v1 Brand Spec](brand/v1/brand-spec.md) · [v1 visual](brand/v1/kardyx-brand-v1.html) · [tokens](brand/v1/tokens.json)
   - [Explorations archive](brand/explorations/INDEX.md) — A / B / C directions reviewed
8. [Deployment](08-deployment.md) — Docker, Railway, Vercel, EAS, CI/CD
9. [Auth & Security](09-auth.md) — Self-hosted Lucia + TOTP 2FA
10. [Payments](10-payments.md) — Mobile money providers (Waychit, Modern Pay, GamSwitch)
11. [Offline & LAN](11-offline.md) — Offline-first play and same-room multiplayer

## Project Structure

```
kardyx/
├── apps/
│   ├── web/        # Next.js 16 → Vercel
│   ├── mobile/     # React Native (Expo) → EAS
│   └── api/        # Fastify (Docker) → Railway
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
│   └── railway/    # Railway config
└── docs/           # This documentation
```

## Tech Stack at a Glance

- **Monorepo:** Turborepo + pnpm + TypeScript
- **Web:** Next.js 16 on Vercel
- **Mobile:** React Native (Expo) with EAS builds + OTA updates
- **API:** Fastify (Node 22) in Docker on Railway
- **Realtime:** Socket.io + Redis adapter
- **CV:** TFLite (mobile native) + TF.js (web PWA)
- **Data:** PostgreSQL + Redis (Railway-managed) + Cloudflare R2
- **Auth:** Lucia self-hosted, Argon2id, TOTP 2FA
- **Payments:** Waychit, Modern Pay, GamSwitch (Phase 1)
- **Design:** Style Dictionary tokens → Tailwind / NativeWind / Figma

## Tagline

> The cards in your hand are the interface. The game lives in the engine.
