# To make use of docker layers, the npm install or yarn install is done first using temprorary directory
# This speeds up the docker build process and will use docker cached layers if the package.json doesn't change.

# Get NPM token from github
ARG NPM_TOKEN
ARG NETWORK_NAME


# Define the node image
FROM node:16.17.1-alpine AS build-sdk
# Below steps installs npm modules of mock-sdk into /usr/app/mock-sdk/ directory
# ENV mock_sdk_dir=/tmp/mock-sdk
# COPY mock-sdk/package*.json mock-sdk/yarn.lock mock-sdk/tsconfig.json mock-sdk/yarn.lock $mock_sdk_dir/
# RUN cd $mock_sdk_dir && yarn
# RUN mkdir -p  /usr/app/mock-sdk && cp -a $mock_sdk_dir/node_modules /usr/app/mock-sdk/

# # Below steps copies actual mock-sdk code
# WORKDIR /usr/app/mock-sdk
# COPY mock-sdk ./
# RUN ls -lR
# RUN yarn && yarn build

FROM build-sdk AS install-dashboard
ARG NPM_TOKEN
ARG NETWORK_NAME
# Below steps installs npm modules of root directory into /usr/app/
ENV dashboard_dir=/tmp
COPY package*.json tsconfig.json yarn.lock $sdk $dashboard_dir/
RUN cd $dashboard_dir
COPY .npmrc.docker .npmrc
RUN yarn install
RUN cp -a node_modules /usr/app/

# Below steps copies actual dashboard code and runs build steps
WORKDIR /usr/app/
COPY . ./

COPY .npmrc.docker .npmrc
RUN echo "PUBLIC_NETWORK_NAME=$NETWORK_NAME" > .env.production
RUN cat .env.production
COPY .env.production .env
RUN yarn add ./mock-sdk
RUN yarn install && yarn build && yarn build-storybook
RUN rm -f .npmrc

# Both the apps can be served as static content.
# Ref: https://vitejs.dev/guide/build.html#building-for-production
FROM nginx:alpine AS storybook
COPY --from=install-dashboard /usr/app/storybook-static /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

FROM nginx:alpine AS dashboard
COPY --from=install-dashboard /usr/app/build /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
