#!/bin/bash

set -e

# Install dependencies
npm install

# Build UI
npx turbo run build --filter=ui

# Run dev servers
npm run dev
