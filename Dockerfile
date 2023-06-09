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
WORKDIR /app

COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json

RUN npm ci

COPY --from=builder /app/out/full/ .
RUN echo "PUBLIC_NETWORK_NAME=$NETWORK_NAME" >> .env.production
RUN cat .env.production
RUN apk add git
RUN npm run db:generate
RUN npx turbo run build --filter=dashboard...

# COPY /app/out/json/ .
# COPY /app/out/package-lock.json ./package-lock.json

# RUN npm ci

# COPY /app/out/full/ .
# RUN npm turbo run build --filter=dashboard...

# COPY .npmrc.docker      /usr/src/app/.npmrc
# # COPY ${NPM_LOCAL_CACHE} /usr/local/share/.cache

# RUN echo "PUBLIC_NETWORK_NAME=$NETWORK_NAME" >> .env.production
# RUN cat .env.production
# RUN apk add git

# # Verify what contents where copied.
# # The .dockerignore file can be adjusted to remove unnecessary files.
# RUN ls /usr/src/app/

# RUN npm ci && \
#     npm run build && \
#     NODE_OPTIONS=--max_old_space_size=4096 npm run build-storybook
# RUN rm -f .npmrc

# RUN ls -lha .

FROM node:20.3.0-alpine AS dashboard

WORKDIR /app

COPY --from=installer /app/apps/dashboard/build build

RUN npm install pm2 -g && \
    pm2 install pm2-metrics

CMD ["pm2-runtime","build/index.js"]

# FROM nginx:alpine AS storybook

# COPY --from=base /usr/src/app/storybook-static /usr/share/nginx/html
# COPY nginx/mime.types /etc/nginx/mime.types
# COPY nginx/default.conf /etc/nginx/conf.d/default.conf
