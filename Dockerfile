ARG BUILDKIT_SBOM_SCAN_CONTEXT=true

FROM oven/bun:latest AS base

ARG BUILDKIT_SBOM_SCAN_STAGE=true
ARG NETWORK_NAME

FROM base AS builder
ARG BUILDKIT_SBOM_SCAN_STAGE=true
ENV IS_DOCKER=true
RUN apt-get update && \
    apt-get install -y libc6 openssl curl git

WORKDIR /app

COPY . .
RUN bun install
RUN bun run turbo prune --scope=dashboard --scope=console --scope=ui --scope=common --docker

FROM base AS installer
ARG BUILDKIT_SBOM_SCAN_STAGE=true
ENV IS_DOCKER=true
ENV NODE_VERSION=16.13.0
RUN apt-get update && \
    apt-get install -y curl
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"
RUN node --version
RUN npm --version

RUN apt-get update && apt-get install -y libc6 && apt-get install -y git

COPY aliases.js /app/aliases.js

WORKDIR /app

COPY .gitignore .gitignore
COPY aliases.js aliases.js
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json
# COPY --from=builder /app/out/bun.lockb ./bun.lockb

RUN bun install
# RUN bun install --frozen-lockfile

COPY --from=builder /app/out/full/ .
RUN echo "PUBLIC_NETWORK_NAME=$NETWORK_NAME" >> apps/dashboard/.env.production
RUN cat apps/dashboard/.env.production
RUN echo "PUBLIC_NETWORK_NAME=$NETWORK_NAME" >> apps/console/.env.production
RUN cat apps/console/.env.production
RUN echo "PUBLIC_NETWORK_NAME=$NETWORK_NAME" >> packages/ui/.env.production
RUN cat packages/ui/.env.production

RUN bun run turbo run build:prod --filter=ui
RUN bun run turbo run build:prod --filter=dashboard
RUN bun run turbo run build:prod --filter=console
RUN bun run turbo run build --filter=ui
RUN rm -f .npmrc

FROM oven/bun:latest AS dashboard
ARG BUILDKIT_SBOM_SCAN_STAGE=true

WORKDIR /app

COPY --from=installer /app/apps/dashboard/prisma/ prisma
COPY --from=installer /app/apps/ apps
COPY --from=installer /app/packages/ packages
COPY --from=installer /app/node_modules node_modules

EXPOSE 3000

CMD ["bun", "apps/dashboard/build/index.js"]

FROM nginx:alpine AS storybook

ARG BUILDKIT_SBOM_SCAN_STAGE=true

WORKDIR /app

COPY --from=installer /app/packages/ui/storybook-static /usr/share/nginx/html
COPY --from=installer /app/packages/ui/nginx/mime.types /etc/nginx/mime.types
COPY --from=installer /app/packages/ui/nginx/default.conf /etc/nginx/conf.d/default.conf

FROM oven/bun:latest AS console
ARG BUILDKIT_SBOM_SCAN_STAGE=true

WORKDIR /app

COPY --from=installer /app/apps/ apps
COPY --from=installer /app/packages/ packages
COPY --from=installer /app/node_modules node_modules

EXPOSE 3000

CMD ["bun", "apps/console/build/index.js"]