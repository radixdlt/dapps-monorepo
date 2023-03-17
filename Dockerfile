FROM node:16.17.1-alpine AS base

ARG NPM_TOKEN
ARG NETWORK_NAME

WORKDIR /usr/src/app

COPY .             /usr/src/app
COPY .npmrc.docker /usr/src/app/.npmrc

RUN echo "PUBLIC_NETWORK_NAME=$NETWORK_NAME" >> .env.production
RUN cat .env.production

# Verify what contents where copied.
# The .dockerignore file can be adjusted to remove unnecessary files.
RUN ls /usr/src/app

RUN yarn install --frozen-lockfile && \
    yarn build && \
    NODE_OPTIONS=--max_old_space_size=4096 yarn build-storybook
RUN rm -f .npmrc

FROM base AS dashboard

WORKDIR /usr/src/app/

COPY --from=base /usr/src/app/build .
COPY --from=base /usr/src/app/package.json .
COPY --from=base /usr/src/app/node_modules  .

RUN npm install pm2 -g && \
    pm2 install pm2-metrics

CMD ["pm2-runtime","build/index.js"]

FROM nginx:alpine AS storybook

COPY --from=base /usr/src/app/storybook-static /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

FROM scratch AS export-yarn-lock
COPY --from=base /usr/src/app/yarn.lock /
