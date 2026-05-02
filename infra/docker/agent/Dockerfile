# syntax=docker/dockerfile:1.7
FROM node:24-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.24.0 --activate
WORKDIR /app

FROM base AS deps
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY apps/agent/package.json apps/agent/
COPY packages/agent-prompts/package.json packages/agent-prompts/
COPY packages/api-contracts/package.json packages/api-contracts/
COPY packages/database/package.json packages/database/
COPY packages/shared/package.json packages/shared/
RUN pnpm install --frozen-lockfile --filter '@radar/agent...'

FROM deps AS build
COPY tsconfig.base.json ./
COPY packages/ packages/
COPY apps/agent/ apps/agent/
RUN pnpm --filter @radar/database generate
RUN pnpm --filter @radar/agent build

FROM base AS runtime
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/packages ./packages
COPY --from=build /app/apps/agent/dist ./apps/agent/dist
COPY --from=build /app/apps/agent/package.json ./apps/agent/
EXPOSE 4000
WORKDIR /app/apps/agent
CMD ["node", "dist/index.js"]
