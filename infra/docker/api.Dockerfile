# syntax=docker/dockerfile:1.7
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.12.0 --activate
WORKDIR /app

# ---------- deps ----------
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json .npmrc ./
COPY turbo.json tsconfig.base.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/types/package.json ./packages/types/
COPY packages/auth/package.json ./packages/auth/
COPY packages/payments/package.json ./packages/payments/
COPY packages/game-engine/package.json ./packages/game-engine/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

# ---------- build ----------
FROM deps AS build
COPY . .
RUN pnpm --filter @kardyx/api build

# ---------- dev (used by docker-compose) ----------
FROM deps AS dev
COPY . .
EXPOSE 4000
CMD ["pnpm", "--filter", "@kardyx/api", "dev"]

# ---------- prod ----------
FROM node:22-alpine AS prod
RUN corepack enable && corepack prepare pnpm@9.12.0 --activate
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/apps/api/package.json ./apps/api/
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/packages ./packages
EXPOSE 4000
CMD ["node", "apps/api/dist/index.js"]
