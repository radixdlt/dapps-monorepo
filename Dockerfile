# Define the node image
FROM node:16-alpine AS build-sdk
ENV mock_sdk_dir=/tmp/mock-sdk
ENV sdk=/tmp/radixdlt-wallet-sdk-v0.1.0-alpha.tgz
COPY mock-sdk/package.json mock-sdk/tsconfig.json mock-sdk/yarn.lock $mock_sdk_dir/
RUN cd $mock_sdk_dir && yarn
RUN mkdir -p  /usr/app/mock-sdk && cp -a $mock_sdk_dir/node_modules /usr/app/mock-sdk/
RUN cp $sdk /usr/app

WORKDIR /usr/app/mock-sdk
COPY mock-sdk ./
RUN ls -lR
RUN yarn && yarn build

FROM build-sdk AS install-dashboard
ENV dashboard_dir=/tmp
COPY package.json tsconfig.json yarn.lock $dashboard_dir/
RUN cd $dashboard_dir && yarn install
RUN cp -a $dashboard_dir/node_modules /usr/app/
WORKDIR /usr/app/
COPY . ./
RUN yarn add ./mock-sdk
RUN yarn install && yarn build

FROM install-dashboard AS dev-server
CMD yarn dev

FROM nginx:alpine AS prod-server
COPY --from=install-dashboard /usr/app/build /usr/share/nginx/html