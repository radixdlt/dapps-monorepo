#!/bin/bash

set -e

# Run local postgresql server
docker compose up -d

# Install dependencies
bun install

# Add DATABASE_URL to .env
echo 'DATABASE_URL="postgresql://user:password@localhost:5432/dashboard?schema=public"' >> apps/dashboard/.env

# Run migrations
bun run turbo run db:push --filter=dashboard

# Run dev servers
bun run dev:dashboard