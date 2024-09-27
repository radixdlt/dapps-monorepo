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

### Run storybook

```
yarn storybook
```
