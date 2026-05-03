# 6. Roadmap to MVP

## Phase 0 — Brand Exploration

**Goal:** Lock the visual and verbal identity before any UI is built.

- Run **Huashu-Design** generation: 3–5 differentiated visual directions
- Logo + wordmark concepts; pick a primary direction
- Define color, typography, motion, and radius tokens
- Create initial character design language (Musa's Turtle as anchor)
- Draft voice & tone guide
- Output: locked design tokens → seeds `packages/tokens` and Figma library

**Exit criteria:** A signed-off brand kit exists in `docs/brand/` and tokens are generated for web + mobile.

---

## Phase 1 — Foundation

**Goal:** A working scanner with a real backend, deployed via Docker.

- Set up monorepo (Turborepo + pnpm) with `apps/{web,mobile,api}` and shared `packages/*`
- Apply Phase 0 brand tokens to scaffolded UI
- Stand up **Fastify** API in Docker, deploy to Railway with managed Postgres + Redis
- **Lucia Auth** with email/password + 2FA enrollment endpoints
- Build **React Native (Expo)** scanner using **TFLite** for standard 52-card recognition
- PostgreSQL schema (Drizzle): users, sessions, audit_log, decks, parties
- Redis-backed game-state store
- GitHub Actions CI: lint, typecheck, unit tests, integration tests with testcontainers
- Vercel preview deploys for web; Railway preview envs for API

**Exit criteria:** Scan any card from a standard deck → API logs the rank/suit, game state persists, all tests green in CI.

---

## Phase 2 — Core Power-Ups

**Goal:** Make scans *do something*.

- Implement **10 core digital triggers**:
  - Lockup, Reverse, Turbo, Boost, Shield, Trade-Off, Topic Trivia, Charades 2.0, Veto, Bounty
- Power-Up engine as a **data-driven, deterministic state machine**
- Realtime sync via **Socket.io** across multiple clients
- Score tracking and basic round logic
- 5-topic selection at session start

**Exit criteria:** Two phones in the same room see synchronized state when a card is scanned and a Power-Up triggers.

---

## Phase 3 — Game Parties & Social

**Goal:** Friends can play together easily.

- Account creation + profile
- Game Party creation with 6-character join codes
- **WhatsApp deep-link invites**
- SMS fallback for offline notification
- Friends list and recent-players invite shortcut
- In-session chat or emote ribbon (lightweight)

**Exit criteria:** A user can create a party, send a WhatsApp invite, and start a game with a remote player.

---

## Phase 4 — Beta with Dungeon Master Mode

**Goal:** Real-world playtest with a host-led experience.

- **Dungeon Master interface** — elevated controls, break triggers, manual round-end
- Session Gallery (private photo storage)
- Telemetry and crash reporting
- Closed beta with 20–50 testers using a physical deck
- Iterate on Power-Up balance based on logs

**Exit criteria:** A 60-minute hosted session runs without engine bugs or sync drift.

---

## Phase 5+ — Post-MVP Expansion

| Theme               | Highlights                                                        |
| ------------------- | ----------------------------------------------------------------- |
| **Premium Decks**   | QR-coded "Kardyx Power-Up" decks; character expansions            |
| **Custom Designer** | Backend tool to mint personalized cards (e.g., Musa's Turtle)     |
| **Tournaments**     | Bracket logic, spectator mode, prize hooks                        |
| **Global Ranking**  | ELO leaderboards per mode, weekly digest emails                   |
| **Power-Up 50–100** | Round out the full vault                                          |
| **Regional Pay**    | Wave, Orange Money, MTN MoMo expansion                            |
| **Bluetooth LAN**   | Peer-to-peer for cellular-only environments                       |
| **WebAuthn**        | Passkeys / hardware key login                                     |
| **Localization**    | English first; expand to French, Wolof, Mandinka, Pulaar          |
| **Monetization**    | Premium decks, character licensing, tournament entry, ads-free    |

---

## Milestones at a Glance

| Phase | Duration (est.) | Output                                  |
| ----- | --------------- | --------------------------------------- |
| 0     | 2–3 weeks       | Brand kit + design tokens locked        |
| 1     | 4–6 weeks       | Card scanner + Dockerized API on Railway|
| 2     | 6–8 weeks       | 10 Power-Ups, realtime sync, LAN play   |
| 3     | 4 weeks         | Parties + WhatsApp invites + payments   |
| 4     | 4 weeks         | DM mode + closed beta                   |
| MVP   | **~5–6 months** | Public soft launch                      |

---

## Risks & Mitigations

| Risk                                      | Mitigation                                                |
| ----------------------------------------- | --------------------------------------------------------- |
| CV recognition fails in low light         | Provide flash toggle; train on diverse lighting datasets  |
| Realtime sync drift across regions        | Use Ably for managed pub/sub if Socket.io scaling stalls  |
| Power-Up balance issues                   | Data-driven definitions allow rapid tuning post-deploy    |
| App store approval delays                 | Ship Next.js PWA in parallel as a backstop                |
| Legal IP overlap with existing card games | Run trademark search before public launch; keep originals |
