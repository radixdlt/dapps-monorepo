# Radix Dashboard

### Running locally

```
yarn
yarn dev
```

or with Docker:

```bash
make dashboard
```

then browse to `localhost:8090`.

### Production

To run the nginx with prebuilt distribution. This setting is intended to be used in production:

```bash
make run-nginx
```

### Run tests

For unit tests:

```
yarn test
```

and for e2e tests:

```
yarn dev
yarn e2etest
```

integration tests are written using [svelte-testing-library](https://github.com/testing-library/svelte-testing-library), and for e2e tests we use [cypress](https://www.cypress.io/).

### Run storybook

```
yarn storybook
```

### App structure

The Radix Dashboard is built with SvelteKit. Here's an overview of the app structure:

#### Core Architecture

- `src/` - Main application source code
  - `lib/` - Base UI components. Many components can also be found in the ui package.
  - `pages/` - Page UI components
  - `routes/` - Routing logic
  - `server/` - Server logic
  - `stores.ts` - Svelte stores for state management
  - `utils.ts` - Utility functions and helpers

Global css is imported from the ui package - `packages/ui/src/global.scss`.

#### Radix Gateway API Integration

The dashboard communicates with the Radix Network through the Gateway API:

- **API Client**: Located in `packages/ui/api/gateway.ts`.
- **Response Processing**: Under `packages/ui/api/utils/`. Transforms API responses into application-specific data structures.

Example of a Gateway API call:
```typescript
// Fetching account details
const accountDetails = await apiClient.getAccountDetails({
  address: accountAddress,
  includeStakes: true,
  includeTokenBalances: true
})
```

#### Radix Engine Integration

The dashboard interacts with the Radix Engine server-side to prevent having to transfer large amounts of javascript to the client. The server api's can be found under `src/routes/api/ret/`.


#### Radix Wallet Integration

The wallet and Radix dApp Toolkit is instantiated in the root layout file (`src/routes/+layout.svelte`). RDT is not SSR-friendly, so we have to instantiate it in the `onMount`. The Radix connect button is imported from `packages/ui/src/components/connect-button`, and is a web component that RDT defines (and becomes available when importing the RDT library).

Sending transactions to the wallet is done through a utility in `packages/ui/src/radix.ts`.

#### Database

We use a database to store information about bookmarked validators. We associate each user's on-chain identity address to a list of validator addresses. The schema can be found at `prisma/schema.prisma` and database client at `src/server/db/db-client.ts`.

#### Authentication

Authentication in the dashboard is handled through the Radix Wallet and persisted server-side:

1. **Initial Connection**: When a user connects their Radix Wallet, they receive a login challenge.
2. **Challenge Signing**: The user signs this challenge with their wallet to prove ownership of their account.
3. **Session Management**: After successful authentication:
   - A session is created server-side
   - A session cookie is set in the browser
   - The user's identity address is stored in the session.
4. **Authorization**: Protected routes and API endpoints verify the session cookie to ensure the user is authenticated.

#### Configuration

Environment-specific configuration is managed through `.env` files with different settings for development, testing, and production environments. Read more here https://svelte.dev/docs/kit/$env-dynamic-public.

# License

The Radix Dashboard code is released under [Apache 2.0 license](LICENSE).

      Copyright 2023 Radix Publishing Ltd

      Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.

      You may obtain a copy of the License at: http://www.apache.org/licenses/LICENSE-2.0

      Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

      See the License for the specific language governing permissions and limitations under the License.
