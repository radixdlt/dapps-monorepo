ARG BUILDKIT_SBOM_SCAN_CONTEXT=true

FROM oven/bun:1.0.6 AS base
ARG BUILDKIT_SBOM_SCAN_STAGE=true
ARG NETWORK_NAME

RUN apt-get update && apt-get install -y libc6 curl openssl
COPY --from=node:18 /usr/local/bin/node /usr/local/bin/node

FROM base AS dashboard
ARG BUILDKIT_SBOM_SCAN_STAGE=true

WORKDIR /app

COPY . .
RUN bun install --ignore-scripts

RUN echo "PUBLIC_NETWORK_NAME=$NETWORK_NAME" >> apps/dashboard/.env.production
RUN cat apps/dashboard/.env.production

RUN bunx svelte-kit sync
RUN bun run turbo build:prod --filter=dashboard

EXPOSE 3000

CMD ["bun", "apps/dashboard/build/index.js"]

FROM base AS console
ARG BUILDKIT_SBOM_SCAN_STAGE=true

WORKDIR /app

COPY . .
RUN bun install --ignore-scripts

RUN echo "PUBLIC_NETWORK_NAME=$NETWORK_NAME" >> apps/console/.env.production
RUN cat apps/console/.env.production

RUN bunx svelte-kit sync
RUN bun run turbo build:prod --filter=console

EXPOSE 3000

CMD ["bun", "apps/console/build/index.js"]

FROM base as storybook-builder
ARG BUILDKIT_SBOM_SCAN_STAGE=true

WORKDIR /app

COPY . .
RUN bun install --ignore-scripts

RUN echo "PUBLIC_NETWORK_NAME=$NETWORK_NAME" >> packages/ui/.env.production
RUN cat packages/ui/.env.production

RUN bun run turbo build:storybook

FROM nginx:alpine AS storybook

ARG BUILDKIT_SBOM_SCAN_STAGE=true

WORKDIR /app

COPY --from=storybook-builder /app/packages/ui/storybook-static /usr/share/nginx/html
COPY --from=storybook-builder /app/packages/ui/nginx/mime.types /etc/nginx/mime.types
COPY --from=storybook-builder /app/packages/ui/nginx/default.conf /etc/nginx/conf.d/default.conf
