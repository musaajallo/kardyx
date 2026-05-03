# 2. Technical Architecture

## Design Goals

- **Absolutely fast** — sub-100ms realtime sync between players
- **Globally distributed** — low latency in The Gambia and worldwide
- **Offline-first** — CV, solo play, and LAN multiplayer all work without internet
- **Cross-platform** — single JS/TS stack across web, iOS, Android
- **Self-hosted core** — no vendor lock-in for auth, payments, or game logic
- **Brand-coherent** — shared design tokens render identically on web and mobile

## Monorepo Layout

```
kardyx/
├── apps/
│   ├── web/                  # Next.js 16 → Vercel
│   ├── mobile/               # React Native (Expo) → EAS
│   └── api/                  # Fastify (Dockerized) → Railway
├── packages/
│   ├── tokens/               # Design tokens (Style Dictionary)
│   ├── ui/                   # Shared components (NativeWind + shadcn)
│   ├── game-engine/          # Pure-TS Power-Up state machine
│   ├── types/                # Shared API + game state types
│   ├── auth/                 # Self-hosted auth (Lucia + TOTP 2FA)
│   ├── payments/             # Mobile money provider abstraction
│   └── cv/                   # Card recognition helpers (TFLite + TF.js)
├── infra/
│   ├── docker/               # API Dockerfile, compose files
│   └── railway/              # Railway deployment config
└── docs/                     # This documentation
```

Tooling: **Turborepo** + **pnpm workspaces** + **TypeScript**.

## Stack by Layer

| Layer              | Technology                                    | Purpose                                          |
| ------------------ | --------------------------------------------- | ------------------------------------------------ |
| Web Client         | **Next.js 16** (App Router, Cache Components) | PWA, marketing, Dungeon Master web view          |
| Mobile Client      | **React Native (Expo)**                       | iOS + Android, OTA updates via EAS               |
| Realtime           | **Socket.io** + Redis adapter                 | WebSocket sync, horizontal scaling on Railway    |
| API Backend        | **Fastify** (Node 22)                         | REST + WebSocket gateway                         |
| ORM                | **Drizzle**                                   | SQL-first, edge-friendly, light bundle           |
| Job Queue          | **BullMQ** (on Redis)                         | Rankings, notifications, AI trivia gen           |
| Computer Vision    | **TFLite** (mobile) + **TF.js** (web PWA)     | Sub-200ms on-device card recognition             |
| Primary DB         | **PostgreSQL** (Railway-managed)              | Users, sessions, rankings, decks, audit log      |
| Cache / Realtime   | **Redis** (Railway-managed)                   | Game state, pub/sub, BullMQ                      |
| Object Storage     | **Cloudflare R2**                             | Session Gallery (opt-in sync), card art          |
| Auth               | **Lucia Auth** + Argon2id + TOTP 2FA          | Self-hosted, no vendor                           |
| Payments           | Waychit, Modern Pay, GamSwitch (Phase 1)      | Provider-agnostic interface; Wave/OM later       |
| Web Hosting        | **Vercel**                                    | Global edge for `apps/web`                       |
| API Hosting        | **Railway** (Docker)                          | Stateful API, Postgres, Redis co-located         |
| Mobile Distribution| **Expo EAS**                                  | iOS / Android binaries + OTA JS updates          |
| Logging            | **Pino** → Railway log drain                  | Structured logs, low overhead                    |
| Observability      | **OpenTelemetry** → Grafana Cloud (free tier) | Traces, metrics                                  |
| Error Tracking     | **Sentry**                                    | Web, mobile, and API                             |

## Service Topology

```
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  Mobile (RN)     │    │  Web PWA (Next)  │    │  Mobile (RN)     │
│  + TFLite CV     │    │  + TF.js CV      │    │  + TFLite CV     │
└────┬─────────────┘    └────┬─────────────┘    └────┬─────────────┘
     │                       │                       │
     │   HTTPS + WSS         │   HTTPS + WSS         │
     │                       ▼                       │
     │            ┌─────────────────────┐            │
     │            │   Vercel Edge       │            │
     │            │   (apps/web)        │            │
     │            └─────────────────────┘            │
     │                       │                       │
     └──────────┬────────────┴───────────────────────┘
                ▼
     ┌──────────────────────────────┐
     │   Railway (Docker)           │
     │   ┌────────────────────────┐ │
     │   │ Fastify API + Socket.io│ │  ← Auth, Parties, Power-Ups
     │   └──────┬─────────────────┘ │
     │          │                   │
     │   ┌──────┴────────┐  ┌─────┐ │
     │   │ PostgreSQL    │  │Redis│ │  ← state, pub/sub, BullMQ
     │   └───────────────┘  └─────┘ │
     └──────────────────────────────┘
                │
                ▼
     ┌──────────────────────┐
     │  Cloudflare R2       │  ← Session Gallery, card art
     └──────────────────────┘

OFFLINE LAN PATH (no internet):
┌──────────────────┐                ┌──────────────────┐
│  Host Phone      │ ──── mDNS ───▶ │  Peer Phone      │
│  embedded        │ ◀── Socket ──▶ │                  │
│  Fastify server  │                │                  │
└──────────────────┘                └──────────────────┘
```

## Connectivity Modes

Kardyx supports three connectivity tiers — content and features adapt to what's available.

| Mode               | Internet | Description                                                              |
| ------------------ | -------- | ------------------------------------------------------------------------ |
| **Online**         | Required | Full feature set: matchmaking, global ranking, premium content, R2 sync |
| **LAN Multiplayer**| None     | Host-led local play via mDNS + WiFi/hotspot (turn-based, authoritative host) |
| **Solo Offline**   | None     | Single-player + AI; only owned content available                         |

### Offline Rules

- **CV runs entirely on-device** — no internet needed to scan cards
- **Owned content** (free decks + previously purchased) cached locally and playable offline
- **New content** requires connectivity to download and license-verify
- **Multiplayer:** LAN works offline; cross-region multiplayer requires internet

### LAN Multiplayer Details

- **Discovery:** `react-native-zeroconf` (mDNS / Bonjour) advertises and discovers parties on local network
- **Host:** one device runs an embedded Fastify + Socket.io server bound to the LAN interface
- **Auth in LAN mode:** lightweight pairing via 6-digit code displayed on the host's screen — no server round-trip
- **Sync to cloud:** when host regains internet, session results upload to PostgreSQL and rankings update
- **Bluetooth fallback:** Phase 5+ stretch goal for cellular-only environments

## Computer Vision Strategy

| Platform | Engine            | Why                                                          |
| -------- | ----------------- | ------------------------------------------------------------ |
| Mobile   | **TFLite native** | 5–10× faster than TF.js on-device; uses Neural Engine / NNAPI |
| Web PWA  | **TF.js (WebGL)** | Browser-only constraint; acceptable for desktop/laptop CV    |

Library: `react-native-fast-tflite` + `react-native-vision-camera` frame processor on mobile.

## Data Flow: A Single Power-Up Trigger

1. Player plays the 8 of Hearts.
2. Camera frame → **TFLite** identifies rank + suit on-device (< 200ms).
3. Client emits `card.scanned` over WebSocket (online) or LAN socket (offline).
4. Fastify resolves rank/suit → looks up the Power-Up mapping ("Lockup") in the **game-engine** package.
5. State mutation in Redis (online) or in-memory on host (LAN).
6. Event broadcast via Socket.io pub/sub to all party clients.
7. Clients render the effect; animations driven by Reanimated 3 / Framer Motion using shared design tokens.
8. Final session results persisted to PostgreSQL when host has connectivity.

## Auth Architecture (Self-Hosted)

- **Lucia Auth** — TypeScript-first, no vendor
- **Argon2id** password hashing (memory cost tuned for mobile-friendly login times)
- **TOTP 2FA** with `otplib`; QR provisioning compatible with Google Authenticator / Authy / 1Password
- **Backup codes:** 10 single-use codes generated at 2FA enrollment
- **Sessions:** HTTP-only secure cookies (web), Expo SecureStore (mobile)
- **Rate limiting:** `@fastify/rate-limit` backed by Redis (per-IP and per-account)
- **Audit log:** every login, 2FA attempt, password change, payment event
- **WebAuthn / Passkeys:** Phase 5 — hardware key + biometric login

## Payments Architecture

Pluggable provider model — same interface, different backends.

```
packages/payments/
├── PaymentProvider.ts        # Common interface
├── providers/
│   ├── waychit.ts            # Phase 1
│   ├── modern-pay.ts         # Phase 1
│   ├── gamswitch.ts          # Phase 1
│   ├── wave.ts               # Phase 5
│   └── orange-money.ts       # Phase 5
└── webhooks/                 # Verified webhook handlers per provider
```

**Common interface:**

```ts
interface PaymentProvider {
  initiate(req: PaymentRequest): Promise<PaymentSession>;
  verifyWebhook(headers, body): Promise<PaymentEvent>;
  refund(paymentId: string, reason?: string): Promise<RefundResult>;
  getStatus(paymentId: string): Promise<PaymentStatus>;
}
```

UI shows region-appropriate providers; user picks one. Webhooks update payment state, which unlocks content via the entitlement service.

## Why JavaScript / TypeScript End-to-End

- One language across mobile, web, backend, and CV — shared types eliminate API drift
- **`packages/game-engine`** runs identically on server, mobile, and web — deterministic for replay / Time Warp
- Faster iteration; lower hiring barrier; rich ecosystem
- TFLite handles the one place where JS performance matters (CV inference) via native bridge

## Performance Budgets

| Metric                          | Target          |
| ------------------------------- | --------------- |
| CV card recognition (on-device) | < 200ms         |
| Power-Up state sync (online)    | < 100ms p95     |
| Power-Up state sync (LAN)       | < 30ms p95      |
| API p95 response                | < 150ms         |
| Cold start (Railway container)  | < 1s            |
| Time-to-Interactive (Web PWA)   | < 2s on 3G      |
| App cold start (mobile)         | < 1.5s          |
