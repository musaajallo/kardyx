# 8. Deployment & Infrastructure

## Hosting Map

| Component        | Host                  | Build / Deploy             |
| ---------------- | --------------------- | -------------------------- |
| `apps/web`       | **Vercel**            | Git push → auto deploy     |
| `apps/api`       | **Railway** (Docker)  | Git push → image build     |
| `apps/mobile`    | **Expo EAS**          | `eas build` + OTA updates  |
| PostgreSQL       | Railway-managed       | Provisioned via Railway    |
| Redis            | Railway-managed       | Provisioned via Railway    |
| Object storage   | Cloudflare R2         | API uploads via S3 SDK     |
| DNS / WAF        | Cloudflare            | `kardyx.com` + subdomains  |

## Environments

| Env         | Purpose                          | URL pattern                     |
| ----------- | -------------------------------- | ------------------------------- |
| `dev`       | Local Docker Compose             | `localhost`                     |
| `preview`   | Per-PR ephemeral env             | `pr-{n}.kardyx.dev`             |
| `staging`   | Internal QA + beta testers       | `staging.kardyx.com`            |
| `production`| Public                           | `kardyx.com`, `api.kardyx.com`  |

## Local Development

One command brings up the full stack except the clients:

```bash
docker compose -f infra/docker/docker-compose.yml up
```

This starts:
- Fastify API (`apps/api`) with hot reload
- PostgreSQL 16
- Redis 7
- Mailhog (for email auth flows in dev)

Web and mobile run natively for fast HMR:
- `pnpm --filter web dev`
- `pnpm --filter mobile start`

### docker-compose.yml (sketch)

```yaml
services:
  api:
    build:
      context: ../..
      dockerfile: infra/docker/api.Dockerfile
      target: dev
    volumes:
      - ../../apps/api:/app/apps/api
    environment:
      DATABASE_URL: postgres://kardyx:kardyx@postgres:5432/kardyx
      REDIS_URL: redis://redis:6379
    depends_on: [postgres, redis]
    ports: ["4000:4000"]

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: kardyx
      POSTGRES_PASSWORD: kardyx
      POSTGRES_DB: kardyx
    volumes: [postgres-data:/var/lib/postgresql/data]
    ports: ["5432:5432"]

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

  mailhog:
    image: mailhog/mailhog
    ports: ["8025:8025"]

volumes:
  postgres-data:
```

## API Dockerfile (Multi-Stage)

```dockerfile
# infra/docker/api.Dockerfile
FROM node:22-alpine AS base
RUN corepack enable
WORKDIR /app

# Dependencies
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/ ./packages/
RUN pnpm install --frozen-lockfile

# Build
FROM deps AS build
COPY . .
RUN pnpm --filter api build

# Dev (used by docker-compose)
FROM deps AS dev
CMD ["pnpm", "--filter", "api", "dev"]

# Production
FROM node:22-alpine AS prod
WORKDIR /app
COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/node_modules ./node_modules
EXPOSE 4000
CMD ["node", "dist/index.js"]
```

## Railway Deployment

```toml
# infra/railway/railway.toml
[build]
builder = "DOCKERFILE"
dockerfilePath = "infra/docker/api.Dockerfile"
dockerfileTarget = "prod"

[deploy]
startCommand = "node dist/index.js"
healthcheckPath = "/health"
healthcheckTimeout = 30
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 5

[[services]]
name = "api"

[[services]]
name = "postgres"
plugin = "postgresql"

[[services]]
name = "redis"
plugin = "redis"
```

### Why Railway

- Postgres + Redis + API co-located → low intra-network latency
- Simpler than AWS for a 1-person team
- Predictable pricing
- First-class Docker support, no proprietary build pipeline lock-in
- Easy migration path to AWS / Fly.io if needed (it's just Docker)

## Vercel Deployment (Web)

- Project root: `apps/web`
- Framework preset: **Next.js**
- Install command: `pnpm install --frozen-lockfile`
- Build command: `pnpm turbo run build --filter=web`
- Output directory: `apps/web/.next`
- Environment variables synced via `vercel env pull`

## Mobile (Expo EAS)

- Builds: `eas build --platform all` for App Store + Play Store binaries
- **OTA updates:** `eas update` ships JS-only changes without app store review
  - Critical for fast Power-Up tuning post-launch
  - Native code changes still require store re-submission
- Channels: `production`, `staging`, `preview` map to environments

## Environment Variables

| Variable                | Where             | Purpose                      |
| ----------------------- | ----------------- | ---------------------------- |
| `DATABASE_URL`          | Railway           | Postgres connection          |
| `REDIS_URL`             | Railway           | Redis connection             |
| `AUTH_SECRET`           | Railway           | Lucia session signing key    |
| `R2_ACCESS_KEY_ID`      | Railway           | Cloudflare R2                |
| `R2_SECRET_ACCESS_KEY`  | Railway           | Cloudflare R2                |
| `WAYCHIT_API_KEY`       | Railway           | Payment provider             |
| `MODERN_PAY_API_KEY`    | Railway           | Payment provider             |
| `GAMSWITCH_API_KEY`     | Railway           | Payment provider             |
| `NEXT_PUBLIC_API_URL`   | Vercel            | Web → API endpoint           |
| `EXPO_PUBLIC_API_URL`   | EAS / app config  | Mobile → API endpoint        |

Secrets stored in Railway / Vercel / EAS secret managers — **never** in repo. `.env.example` files in each app document required keys.

## CI/CD Pipeline

```
Push to PR branch
   │
   ├── GitHub Actions
   │     ├── pnpm install + cache
   │     ├── Lint (eslint, prettier)
   │     ├── Typecheck (tsc --noEmit)
   │     ├── Unit tests (vitest)
   │     └── Integration tests (testcontainers + Postgres + Redis)
   │
   ├── Vercel: build preview for apps/web
   └── Railway: build preview env for apps/api

Merge to main
   ├── Vercel: deploy to production
   └── Railway: deploy to production

Manual mobile release
   └── EAS build + submit
```

## Observability

- **Logs:** Pino → Railway log drain → Grafana Cloud Loki
- **Metrics:** OpenTelemetry → Grafana Cloud (free tier sufficient at MVP scale)
- **Errors:** Sentry projects for `web`, `mobile`, `api`
- **Uptime:** Better Stack pings `/health` on the API every 60s
- **Alerts:** PagerDuty (or simple email/SMS at MVP) on:
  - API p95 > 500ms for 5 min
  - Error rate > 1% for 5 min
  - Postgres connection failures
  - Payment webhook failures

## Backup & Recovery

- **Postgres:** Railway daily snapshots (kept 7 days), weekly off-site export to R2
- **Redis:** ephemeral by design; game state recoverable from Postgres snapshots
- **R2:** versioning enabled on Session Gallery bucket
- **Disaster recovery target:** RPO 24h / RTO 4h at MVP

## Cost Snapshot (MVP, est.)

| Service          | Monthly (USD) |
| ---------------- | ------------- |
| Railway          | ~$20–50       |
| Vercel (Hobby)   | $0            |
| Cloudflare R2    | ~$5           |
| Sentry (free)    | $0            |
| Grafana (free)   | $0            |
| Domains          | ~$5/mo amortized |
| EAS              | $29/mo (Production plan) |
| **Total**        | **~$60–90/mo** |

Scales linearly with users; renegotiate when active sessions > 1k concurrent.
