# To make use of docker layers, the npm install or yarn install is done first using temprorary directory
# This speeds up the docker build process and will use docker cached layers if the package.json doesn't change.

# Define the node image
FROM node:16-alpine AS build-sdk
# Below steps installs npm modules of mock-sdk into /usr/app/mock-sdk/ directory
ENV mock_sdk_dir=/tmp/mock-sdk
COPY mock-sdk/package*.json mock-sdk/tsconfig.json mock-sdk/yarn.lock $mock_sdk_dir/
RUN cd $mock_sdk_dir && yarn
RUN mkdir -p  /usr/app/mock-sdk && cp -a $mock_sdk_dir/node_modules /usr/app/mock-sdk/

# Below steps copies actual mock-sdk code
WORKDIR /usr/app/mock-sdk
COPY mock-sdk ./
RUN ls -lR
RUN yarn && yarn build

FROM build-sdk AS install-dashboard
# Below steps installs npm modules of root directory into /usr/app/
ENV dashboard_dir=/tmp
ENV sdk=radixdlt-wallet-sdk-v0.1.0-alpha.tgz
COPY package*.json tsconfig.json yarn.lock $sdk $dashboard_dir/
RUN cd $dashboard_dir && yarn install
RUN cp -a $dashboard_dir/node_modules /usr/app/

# Below steps copies actual dashboard code and runs build steps
WORKDIR /usr/app/
COPY . ./
RUN yarn add ./mock-sdk
RUN yarn install && yarn build

FROM install-dashboard AS dev-server
CMD yarn dev

FROM nginx:16.17.1-alpine AS prod-server
COPY --from=install-dashboard /usr/app/build /usr/share/nginx/html