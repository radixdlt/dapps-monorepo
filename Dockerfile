FROM node:20.3.0-alpine AS base

ARG NPM_TOKEN
ARG NETWORK_NAME
ARG NPM_LOCAL_CACHE=.cache

FROM base AS builder
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=dashboard --docker

FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
COPY .npmrc.docker      /app/.npmrc
# COPY ${NPM_LOCAL_CACHE} /usr/local/share/.cache
WORKDIR /app

COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json

RUN npm ci

COPY --from=builder /app/out/full/ .
RUN echo "PUBLIC_NETWORK_NAME=$NETWORK_NAME" >> .env.production
RUN cat .env.production
RUN npx turbo run build --filter=dashboard...
RUN NODE_OPTIONS=--max_old_space_size=4096 npx turbo run build:storybook --filter=dashboard...
RUN rm -f .npmrc

FROM node:20.3.0-alpine AS dashboard

WORKDIR /app

COPY --from=installer /app/apps/dashboard/build build
COPY --from=installer /app/apps/dashboard/prisma prisma
COPY --from=installer /app/apps/dashboard/package.json package.json
COPY --from=installer /app/apps/dashboard/node_modules node_modules

RUN npm install pm2 -g && \
    pm2 install pm2-metrics

CMD ["pm2-runtime","build/index.js"]

FROM nginx:alpine AS storybook

WORKDIR /app

COPY --from=installer /app/apps/dashboard/storybook-static /usr/share/nginx/html
COPY /apps/dashboard/nginx/mime.types /etc/nginx/mime.types
COPY /apps/dashboard/nginx/default.conf /etc/nginx/conf.d/default.conf
