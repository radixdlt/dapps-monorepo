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

# License

The Radix Dashboard code is released under [Apache 2.0 license](LICENSE).

      Copyright 2023 Radix Publishing Ltd

      Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.

      You may obtain a copy of the License at: http://www.apache.org/licenses/LICENSE-2.0

      Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

      See the License for the specific language governing permissions and limitations under the License.
