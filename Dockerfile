ARG BUILDKIT_SBOM_SCAN_CONTEXT=true

FROM node:20.3.1-alpine AS base
ARG BUILDKIT_SBOM_SCAN_STAGE=true

ARG NPM_TOKEN
ARG NETWORK_NAME
ARG NPM_LOCAL_CACHE=.cache

FROM base AS builder
ARG BUILDKIT_SBOM_SCAN_STAGE=true

RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=dashboard --scope=console --scope=ui --docker

FROM base AS installer
ARG BUILDKIT_SBOM_SCAN_STAGE=true

RUN apk add --no-cache libc6-compat
RUN apk update
COPY .npmrc.docker      /app/.npmrc
COPY aliases.js /app/aliases.js
# COPY ${NPM_LOCAL_CACHE} /usr/local/share/.cache
WORKDIR /app

COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json

RUN npm ci

COPY --from=builder /app/out/full/ .
RUN echo "PUBLIC_NETWORK_NAME=$NETWORK_NAME" >> apps/dashboard/.env.development
RUN cat apps/dashboard/.env.development
RUN npx turbo run build --filter=ui
RUN npx turbo run build --filter=dashboard
RUN npx turbo run build --filter=console
RUN NODE_OPTIONS=--max_old_space_size=4096 npx turbo run build --filter=ui
RUN rm -f .npmrc

FROM node:20.3.1-alpine AS dashboard
ARG BUILDKIT_SBOM_SCAN_STAGE=true

WORKDIR /app

COPY --from=installer /app/apps/dashboard/build build
COPY --from=installer /app/apps/dashboard/prisma prisma
COPY --from=installer /app/apps/dashboard/package.json package.json
COPY --from=installer /app/node_modules node_modules

RUN npm install pm2 -g && \
    pm2 install pm2-metrics

CMD ["pm2-runtime","build/index.js"]

FROM nginx:alpine AS storybook
ARG BUILDKIT_SBOM_SCAN_STAGE=true

WORKDIR /app

COPY --from=installer /app/packages/ui/storybook-static /usr/share/nginx/html
COPY --from=installer /app/packages/ui/nginx/mime.types /etc/nginx/mime.types
COPY --from=installer /app/packages/ui/nginx/default.conf /etc/nginx/conf.d/default.conf

FROM node:20.3.1-alpine AS console
ARG BUILDKIT_SBOM_SCAN_STAGE=true

WORKDIR /app

COPY --from=installer /app/apps/console/build build
COPY --from=installer /app/apps/console/package.json package.json
COPY --from=installer /app/node_modules node_modules

RUN npm install pm2 -g && \
    pm2 install pm2-metrics

EXPOSE 3000

CMD ["pm2-runtime","build/index.js"]
