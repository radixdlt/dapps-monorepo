ARG BUILDKIT_SBOM_SCAN_CONTEXT=true

FROM node:21.4-bullseye-slim AS base
ARG BUILDKIT_SBOM_SCAN_STAGE=true

ARG NETWORK_NAME
ARG NPM_LOCAL_CACHE=.cache

RUN apt-get update && apt-get install -y openssh-client

FROM base AS sandbox-builder
ARG BUILDKIT_SBOM_SCAN_STAGE=true

WORKDIR /app

RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=sandbox --scope=common --docker

FROM base AS sandbox-installer
ARG BUILDKIT_SBOM_SCAN_STAGE=true
ARG NETWORK_NAME
ENV VITE_NETWORK_NAME=$NETWORK_NAME

ARG IS_PUBLIC
ENV VITE_IS_PUBLIC=$IS_PUBLIC

WORKDIR /app

COPY .gitignore .gitignore
COPY aliases.js aliases.js
COPY --from=sandbox-builder /app/out/json/ .
COPY --from=sandbox-builder /app/out/package-lock.json ./package-lock.json

RUN npm ci --ignore-scripts

COPY --from=sandbox-builder /app/out/full/ .

RUN npx turbo run build:prod --filter=sandbox
RUN rm -f .npmrc

FROM base AS console-builder
ARG BUILDKIT_SBOM_SCAN_STAGE=true

WORKDIR /app

RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=console --scope=ui --scope=common --docker

FROM base AS console-installer
ARG BUILDKIT_SBOM_SCAN_STAGE=true

WORKDIR /app

COPY .gitignore .gitignore
COPY aliases.js aliases.js
COPY --from=console-builder /app/out/json/ .
COPY --from=console-builder /app/out/package-lock.json ./package-lock.json

RUN npm ci

COPY --from=console-builder /app/out/full/ .
RUN echo "PUBLIC_NETWORK_NAME=$NETWORK_NAME" >> apps/console/.env.production
RUN cat apps/console/.env.production

RUN npx turbo run prepare
RUN npx turbo run build:prod --filter=console
RUN rm -f .npmrc

FROM base AS dashboard-builder
ARG BUILDKIT_SBOM_SCAN_STAGE=true

RUN apt-get update && apt-get install -y libc6 openssl

WORKDIR /app

RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=dashboard --scope=ui --scope=common --docker

FROM base AS dashboard-installer
ARG BUILDKIT_SBOM_SCAN_STAGE=true

RUN apt-get update && apt-get install -y libc6

WORKDIR /app

COPY .gitignore .gitignore
COPY aliases.js aliases.js
COPY --from=dashboard-builder /app/out/json/ .
COPY --from=dashboard-builder /app/out/package-lock.json ./package-lock.json

RUN npm ci

COPY --from=dashboard-builder /app/out/full/ .
RUN echo "PUBLIC_NETWORK_NAME=$NETWORK_NAME" >> apps/dashboard/.env.production
RUN cat apps/dashboard/.env.production

RUN npx turbo run prepare
RUN npx turbo run build:prod --filter=dashboard
RUN rm -f .npmrc

FROM node:21.4-bullseye-slim AS dashboard

ARG BUILDKIT_SBOM_SCAN_STAGE=true

WORKDIR /app

COPY --from=dashboard-installer /app/apps/dashboard/prisma/ prisma
COPY --from=dashboard-installer /app/apps/ apps
COPY --from=dashboard-installer /app/packages/ packages
COPY --from=dashboard-installer /app/node_modules node_modules

RUN npm install pm2 -g && \
    pm2 install pm2-metrics

CMD ["pm2-runtime","apps/dashboard/build/index.js"]

FROM base AS storybook-builder
ARG BUILDKIT_SBOM_SCAN_STAGE=true

WORKDIR /app

RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=ui --scope=common --docker

FROM base AS storybook-installer
ARG BUILDKIT_SBOM_SCAN_STAGE=true

RUN apt-get update && apt-get install -y libc6

WORKDIR /app

COPY .gitignore .gitignore
COPY aliases.js aliases.js
COPY --from=storybook-builder /app/out/json/ .
COPY --from=storybook-builder /app/out/package-lock.json ./package-lock.json

RUN npm ci

COPY --from=dashboard-builder /app/out/full/ .
RUN echo "PUBLIC_NETWORK_NAME=$NETWORK_NAME" >> packages/ui/.env.production
RUN cat packages/ui/.env.production

RUN npx turbo run prepare
RUN npx turbo run build:prod --filter=ui
RUN rm -f .npmrc

FROM nginx:alpine AS storybook

ARG BUILDKIT_SBOM_SCAN_STAGE=true

WORKDIR /app

COPY --from=storybook-installer /app/packages/ui/storybook-static /usr/share/nginx/html
COPY --from=storybook-installer /app/packages/ui/nginx/mime.types /etc/nginx/mime.types
COPY --from=storybook-installer /app/packages/ui/nginx/default.conf /etc/nginx/conf.d/default.conf

FROM nginx:alpine AS sandbox

ARG BUILDKIT_SBOM_SCAN_STAGE=true

WORKDIR /app
RUN rm -rf /usr/share/nginx/html/*
COPY --from=sandbox-installer /app/apps/sandbox/dist /usr/share/nginx/html
COPY --from=sandbox-installer /app/apps/sandbox/.nginx/nginx.conf /etc/nginx/nginx.conf

COPY --from=sandbox-installer /app/apps/sandbox/src/assets/favicon.png /usr/share/nginx/html/assets/favicon.png
COPY --from=sandbox-installer /app/apps/sandbox/src/assets/sandbox_icon.png /usr/share/nginx/html/assets/sandbox_icon.png

FROM node:21.4-bullseye-slim AS console

ARG BUILDKIT_SBOM_SCAN_STAGE=true

WORKDIR /app

COPY --from=console-installer /app/apps/ apps
COPY --from=console-installer /app/packages/ packages
COPY --from=console-installer /app/node_modules node_modules

RUN npm install pm2 -g && \
    pm2 install pm2-metrics

EXPOSE 3000

CMD ["pm2-runtime","apps/console/build/index.js"]
