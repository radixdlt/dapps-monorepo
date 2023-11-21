# dApps Monorepo 👋

## Required

You need to have the following tools installed to run the local development server:

- Node v20.3.0
- NPM v9.7.1
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

# License

* [Radix Dashboard](apps/dashboard/README.md#license) 
* [Radix Console](apps/console/README.md#license)
* [dApp Sandbox](apps/sandbox/README.md#license)