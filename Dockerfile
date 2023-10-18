ARG BUILDKIT_SBOM_SCAN_CONTEXT=true

FROM oven/bun:1.0.6 AS base
ARG BUILDKIT_SBOM_SCAN_STAGE=true
ARG NETWORK_NAME

FROM base AS dashboard
ARG BUILDKIT_SBOM_SCAN_STAGE=true

WORKDIR /app

COPY . .
RUN bun install --ignore-scripts --frozen-lockfile

RUN apt-get update && apt-get install -y libc6 openssl git
RUN bun run turbo build:prod --filter=dashboard

RUN bun install pm2 -g && \
    pm2 install pm2-metrics

EXPOSE 3000

CMD ["pm2-runtime","apps/console/build/index.js"]

# FROM base AS console-installer
# ARG BUILDKIT_SBOM_SCAN_STAGE=true

# ENV NODE_VERSION=16.13.0
# RUN apt-get update && \
#     apt-get install -y curl
# RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
# ENV NVM_DIR=/root/.nvm
# RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
# RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
# RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
# ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"
# RUN node --version
# RUN npm --version

# RUN apt-get update && apt-get install -y libc6

# WORKDIR /app

# COPY .gitignore .gitignore
# COPY aliases.js aliases.js
# COPY --from=console-builder /app/out/json/ .
# # COPY --from=console-builder /app/out/package-lock.json ./package-lock.json

# RUN bun install --no-scripts
# # RUN bun install --frozen-lockfile

# COPY --from=console-builder /app/out/full/ .
# RUN echo "PUBLIC_NETWORK_NAME=$NETWORK_NAME" >> apps/console/.env.production
# RUN cat apps/console/.env.production

# RUN bunx turbo run prepare
# RUN bunx turbo run build:prod --filter=console
# RUN rm -f .npmrc


# FROM base AS dashboard-builder
# ARG BUILDKIT_SBOM_SCAN_STAGE=true

# RUN apt-get update && apt-get install -y libc6 openssl

# WORKDIR /app

# # RUN npm install -g turbo
# COPY . .
# RUN bunx turbo prune --scope=dashboard --scope=ui --scope=common --docker

# FROM base AS dashboard-installer
# ARG BUILDKIT_SBOM_SCAN_STAGE=true

# RUN apt-get update && apt-get install -y libc6

# WORKDIR /app

# COPY .gitignore .gitignore
# COPY aliases.js aliases.js
# COPY --from=dashboard-builder /app/out/json/ .
# COPY --from=dashboard-builder /app/out/package-lock.json ./package-lock.json

# RUN npm ci

# COPY --from=dashboard-builder /app/out/full/ .
# RUN echo "PUBLIC_NETWORK_NAME=$NETWORK_NAME" >> apps/dashboard/.env.production
# RUN cat apps/dashboard/.env.production

# RUN bunx turbo run prepare
# RUN bunx turbo run build:prod --filter=dashboard
# RUN rm -f .npmrc

# FROM oven/bun:latest AS dashboard
# ARG BUILDKIT_SBOM_SCAN_STAGE=true

# WORKDIR /app

# COPY --from=dashboard-installer /app/apps/dashboard/prisma/ prisma
# COPY --from=dashboard-installer /app/apps/ apps
# COPY --from=dashboard-installer /app/packages/ packages
# COPY --from=dashboard-installer /app/node_modules node_modules

# EXPOSE 3000

# CMD ["bun", "apps/dashboard/build/index.js"]

# FROM base AS storybook-builder
# ARG BUILDKIT_SBOM_SCAN_STAGE=true

# WORKDIR /app

# RUN bun install --no-scripts
# COPY . .
# RUN bun run turbo prune --scope=ui --scope=common --docker

# FROM base AS storybook-installer
# ARG BUILDKIT_SBOM_SCAN_STAGE=true

# RUN apt-get update && apt-get install -y libc6

# WORKDIR /app

# COPY .gitignore .gitignore
# COPY aliases.js aliases.js
# COPY --from=storybook-builder /app/out/json/ .
# # COPY --from=storybook-builder /app/out/package-lock.json ./package-lock.json

# RUN bun install --no-scripts

# COPY --from=dashboard-builder /app/out/full/ .
# RUN echo "PUBLIC_NETWORK_NAME=$NETWORK_NAME" >> packages/ui/.env.production
# RUN cat packages/ui/.env.production

# RUN bunx turbo run prepare
# RUN bunx turbo run build:prod --filter=ui
# RUN rm -f .npmrc


# FROM nginx:alpine AS storybook

# ARG BUILDKIT_SBOM_SCAN_STAGE=true

# WORKDIR /app

# COPY --from=storybook-installer /app/packages/ui/storybook-static /usr/share/nginx/html
# COPY --from=storybook-installer /app/packages/ui/nginx/mime.types /etc/nginx/mime.types
# COPY --from=storybook-installer /app/packages/ui/nginx/default.conf /etc/nginx/conf.d/default.conf

# FROM oven/bun:latest AS console
# ARG BUILDKIT_SBOM_SCAN_STAGE=true

# WORKDIR /app

# COPY --from=console-installer /app/apps/ apps
# COPY --from=console-installer /app/packages/ packages
# COPY --from=console-installer /app/node_modules node_modules

# EXPOSE 3000

# CMD ["bun", "apps/console/build/index.js"]