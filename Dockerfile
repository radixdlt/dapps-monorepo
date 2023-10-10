ARG BUILDKIT_SBOM_SCAN_CONTEXT=true

FROM node:20.8-bookworm AS base
ARG BUILDKIT_SBOM_SCAN_STAGE=true

ARG NETWORK_NAME
ARG NPM_LOCAL_CACHE=.cache

RUN apt-get update && apt-get install -y openssh-client=1:9.2p1-2+deb12u1

FROM base AS builder
ARG BUILDKIT_SBOM_SCAN_STAGE=true

RUN apt-get update && apt-get install -y libc6 openssl openssh-client=1:9.2p1-2+deb12u1

WORKDIR /app

RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=dashboard --scope=console --scope=ui --docker

FROM base AS installer
ARG BUILDKIT_SBOM_SCAN_STAGE=true

RUN apt-get update && apt-get install -y libc6

COPY aliases.js /app/aliases.js

WORKDIR /app

COPY .gitignore .gitignore
COPY aliases.js aliases.js
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json

RUN npm ci

COPY --from=builder /app/out/full/ .
RUN echo "PUBLIC_NETWORK_NAME=$NETWORK_NAME" >> apps/dashboard/.env.production
RUN cat apps/dashboard/.env.production
RUN echo "PUBLIC_NETWORK_NAME=$NETWORK_NAME" >> apps/console/.env.production
RUN cat apps/console/.env.production
RUN echo "PUBLIC_NETWORK_NAME=$NETWORK_NAME" >> packages/ui/.env.production
RUN cat packages/ui/.env.production

RUN npx turbo run prepare
RUN npx turbo run build:prod --filter=ui
RUN npx turbo run build:prod --filter=dashboard
RUN npx turbo run build:prod --filter=console
RUN NODE_OPTIONS=--max_old_space_size=4096 npx turbo run build --filter=ui
RUN rm -f .npmrc

FROM node:20.8-bookworm AS dashboard

ARG BUILDKIT_SBOM_SCAN_STAGE=true

RUN apt-get update && apt-get install -y openssh-client=1:9.2p1-2+deb12u1

WORKDIR /app

COPY --from=installer /app/apps/dashboard/prisma/ prisma
COPY --from=installer /app/apps/ apps
COPY --from=installer /app/packages/ packages
COPY --from=installer /app/node_modules node_modules

RUN npm install pm2 -g && \
    pm2 install pm2-metrics

CMD ["pm2-runtime","apps/dashboard/build/index.js"]

FROM nginx:alpine AS storybook

ARG BUILDKIT_SBOM_SCAN_STAGE=true

WORKDIR /app

COPY --from=installer /app/packages/ui/storybook-static /usr/share/nginx/html
COPY --from=installer /app/packages/ui/nginx/mime.types /etc/nginx/mime.types
COPY --from=installer /app/packages/ui/nginx/default.conf /etc/nginx/conf.d/default.conf

FROM node:20.8-bookworm AS console

ARG BUILDKIT_SBOM_SCAN_STAGE=true

RUN apt-get update && apt-get install -y openssh-client=1:9.2p1-2+deb12u1

WORKDIR /app

COPY --from=installer /app/apps/ apps
COPY --from=installer /app/packages/ packages
COPY --from=installer /app/node_modules node_modules

RUN npm install pm2 -g && \
    pm2 install pm2-metrics

EXPOSE 3000

CMD ["pm2-runtime","apps/console/build/index.js"]
