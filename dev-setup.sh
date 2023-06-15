#!/bin/bash

set -e

# Run local postgresql server
docker compose up -d

# Install dependencies
npm install

# Add DATABASE_URL to .env
echo 'DATABASE_URL="postgresql://user:password@localhost:5432/dashboard?schema=public"' >> apps/dashboard/.env

# Run migrations
npx turbo run db:push --filter=dashboard

# Build UI
npx turbo run build --filter=ui

# Run dev servers
npm run dev