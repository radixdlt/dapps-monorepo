# Radix Console


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

### Run storybook

```
yarn storybook
```

### Gateway SDK

There's a specific command for updating the gateway sdk dependency:

```
PUBLIC_NETWORK_NAME=<network> yarn update:gateway
```

where `<network>` is the network (hammunet, etc) to use.

This updates the gateway sdk, and generates mocks for all the api responses.

In order for the UI tests to work, this command should be used when updating the gateway sdk.

### Code structure

## Components

Components are defined under the `components` folder, which has a subfolder named `_base`. The `_base` folder contains lower level base components, such as `button`. These are generally made to be reused by higher level components.

Most components are accompanied by a story, for example `button.stories.svelte`. We use [storybook](https://storybook.js.org/) to implement stories. Stories and unit tests live right next to component files.

## Styling

We use [stitches](https://stitches.dev/) to implement and organize our css. This gives us convenient tools to manage theming and reusable styles. Styles are defined in the component `<script>` tag.

For theming and other repo-wide style config, there's a `src/styles.ts` file with definitions for things like colors and spacing. Having a robust style config, and always referring to it when creating styles helps us keep the look and feel of the UI consistent.

# License

The Radix Developer Console code is released under [Apache 2.0 license](LICENSE).

      Copyright 2023 Radix Publishing Ltd

      Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.

      You may obtain a copy of the License at: http://www.apache.org/licenses/LICENSE-2.0

      Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

      See the License for the specific language governing permissions and limitations under the License.
