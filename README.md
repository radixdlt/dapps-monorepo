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

# License

* [Radix Dashboard](apps/dashboard/README.md#license) 
* [Radix Console](apps/console/README.md#license)
* [dApp Sandbox](apps/sandbox/README.md#license)