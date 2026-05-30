# syntax=docker/dockerfile:1.7
# ─────────────────────────────────────────────────────────────────────────
# RADAR — apps/web Dockerfile (Next.js 16 + Prisma 6 + Better Auth)
# Multi-stage : deps (cache layer) → builder → runner (image finale ~200MB)
#
# Build depuis la racine du monorepo :
#   docker build -t radar-web -f infra/docker/web/Dockerfile .
#
# Utilisé par : infra/docker/stack-complet/docker-compose.yml (service `web`)
# ─────────────────────────────────────────────────────────────────────────

ARG NODE_VERSION=24-alpine

# ── STAGE 1 : deps ──────────────────────────────────────────────────────
# Couche cachée : ne se rebuild que si les manifests pnpm changent.
FROM node:${NODE_VERSION} AS deps
WORKDIR /app

# Outils nécessaires à pnpm + Prisma engines + sharp (image optim Next)
RUN apk add --no-cache libc6-compat openssl
RUN corepack enable && corepack prepare pnpm@10.24.0 --activate

# Copy uniquement les manifests pour cache layer optimal
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY tsconfig.base.json ./
COPY apps/web/package.json ./apps/web/
COPY apps/agent/package.json ./apps/agent/
COPY packages/contracts/package.json ./packages/contracts/
COPY packages/database/package.json ./packages/database/

RUN pnpm install --frozen-lockfile --prefer-offline

# ── STAGE 2 : builder ────────────────────────────────────────────────────
FROM node:${NODE_VERSION} AS builder
WORKDIR /app

RUN apk add --no-cache libc6-compat openssl
RUN corepack enable && corepack prepare pnpm@10.24.0 --activate

# Copy deps installées + tout le code
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=deps /app/packages ./packages
COPY . .

# Génère le client Prisma (lit packages/database/prisma/schema.prisma)
# Note : ne pas faire de migration ici, juste générer le client TS.
RUN pnpm --filter @radar/database exec prisma generate

# Build Next.js (Turbopack, output standalone pour image légère)
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter @radar/web build

# ── STAGE 3 : runner (image finale) ──────────────────────────────────────
FROM node:${NODE_VERSION} AS runner
WORKDIR /app

# Sécurité : run as non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copy uniquement le build standalone Next.js + assets statiques
# (cf. apps/web/next.config.ts → output: "standalone" requis)
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

# Copy Prisma engines (requis au runtime pour les queries)
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.pnpm/@prisma+client* ./node_modules/.pnpm/
COPY --from=builder --chown=nextjs:nodejs /app/packages/database/generated ./packages/database/generated

USER nextjs
EXPOSE 3000

# server.js est généré par Next.js standalone output
CMD ["node", "apps/web/server.js"]
