# Radix dApps Monorepo 👋

## Prerequisites

You need to have the following tools installed to run the local development server:

- Node >= 20
- NPM
- [Docker client](https://www.docker.com)

## Getting started

Fastest way to getting a dev server running on your local machine is to run the following bash script in your terminal from the repo top directory.

```bash
./dev-setup.sh
```

## Running scripts

dApps monorepo is built on [Turbo repo](https://turbo.build/repo/docs) for faster npm script execution through caching and parallelization.

_*Run npm scripts from the repo top directory*_

### Install all dependencies

```bash
npm install
```

### Start development servers

```bash
npm run dev
```

### Linting, testing, pre-compiling

```bash
npm run pre-push
```

### Test

```bash
npm run test
```

# dApps

## Dashboard

##### [Mainnet](https://dashboard.radixdlt.com/) • [Stokenet](https://stokenet-dashboard.radixdlt.com/) • [Development](https://dev-dashboard.rdx-works-main.extratools.works/)


Search for addresses and transactions on the Radix Network. Participate in Radix Network staking using XRD tokens.

## Console

##### [Mainnet](https://console.radixdlt.com/) • [Stokenet](https://stokenet-console.radixdlt.com/) • [Development](https://dev-console.rdx-works-main.extratools.works/)

A collection of utility pages to help you during development of your own dApps.

## Sandbox

##### [Mainnet](https://sandbox.radixdlt.com/) • [Stokenet](https://stokenet-sandbox.radixdlt.com/) • [Development](https://dev-sandbox.rdx-works-main.extratools.works/)

A configurable dApp frontend simulator to let you experiment with Radix Wallet logins and requests for data. Development environment contains additional pages which can be used to play around with various wallet and network features.

# Packages

## common

Wrapper package for dependencies reused in different dApps. It contains dependencies that almost every Radix-based project needs like [RDT](https://github.com/radixdlt/radix-dapp-toolkit), [Gateway SDK](https://www.npmjs.com/package/@radixdlt/babylon-gateway-api-sdk), [Core SDK](https://www.npmjs.com/package/@radixdlt/babylon-core-api-sdk), [Rola](https://github.com/radixdlt/rola), [RET](https://github.com/radixdlt/typescript-radix-engine-toolkit).

## ui

Set of svelte components reused between Dev Console and Dashboard apps. Contains main dApp layout - header, side menu and other smaller components.

## eslint-config-custom

Custom ESLint configuration used by other packages and apps.

# Deployment

Each app is a SvelteKit application. The default adapter is `@sveltejs/adapter-node`, which produces a standalone Node.js server.

## Environment variables

The apps use the following environment variables (set via `.env` files or your platform's environment configuration):

| Variable | Description |
|---|---|
| `PUBLIC_NETWORK_NAME` | Radix network to target (e.g. `mainnet`, `stokenet`) |
| `PUBLIC_AMPLITUDE_API_KEY` | Amplitude analytics key (optional) |
| `PUBLIC_APP_ENV` | App environment identifier (e.g. `production`, `development`) |

## Node.js (default)

Build and run an individual app:

```bash
npm install
npx turbo run build --filter=dashboard
node apps/dashboard/build
```

Replace `dashboard` with `console` or `sandbox` as needed.

The build output is written to `apps/<app>/build/` by default. The Node.js server listens on port `3000` (configurable via the `PORT` environment variable).

## Serverless (Vercel)

To deploy on Vercel, you need to switch SvelteKit from the Node adapter to the Vercel adapter:

1. In `packages/ui/svelte.config.js`, change the import from `@sveltejs/adapter-node` to `@sveltejs/adapter-vercel`, and change `adapter: adapter({ out: 'build' })` to `adapter: adapter()`.
2. In the `devDependencies` of each app's `package.json` (`apps/console/package.json`, `apps/dashboard/package.json`) and `packages/ui/package.json`, replace `"@sveltejs/adapter-auto"` with `"@sveltejs/adapter-vercel": "^5"`.
3. Deploy on Vercel (repeat for each app you want to deploy):
   1. Go to [vercel.com](https://vercel.com) and open your dashboard.
   2. Click **Add New** → **Project**.
   3. Select this repository (fork/clone it to your GitHub account first if needed). Vercel should automatically detect it as a Turborepo monorepo.
   4. Under **Root Directory**, change it to the app you want to deploy (e.g. `apps/dashboard`, `apps/console`, or `apps/sandbox`).
   5. Configure the environment variables listed above under **Environment Variables**.
   6. Click **Deploy**.

   You need to create a separate Vercel project for each app you want to deploy.

# License

* [Radix Dashboard](apps/dashboard/README.md#license) 
* [Radix Console](apps/console/README.md#license)
* [dApp Sandbox](apps/sandbox/README.md#license)