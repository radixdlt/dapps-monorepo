# To make use of docker layers, the npm install or yarn install is done first using temprorary directory
# This speeds up the docker build process and will use docker cached layers if the package.json doesn't change.

# Get NPM token from github
ARG NPM_TOKEN
ARG NETWORK_NAME


FROM node:16.17.1-alpine AS install-dashboard
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
RUN echo "PUBLIC_NETWORK_NAME=$NETWORK_NAME" >> .env.production
RUN cat .env.production

RUN yarn install && yarn build && NODE_OPTIONS=--max_old_space_size=4096 yarn build-storybook
RUN rm -f .npmrc

FROM install-dashboard AS node-adapter
WORKDIR /usr/app/
COPY --from=install-dashboard /usr/app/build .
COPY --from=install-dashboard /usr/app/package.json .
COPY --from=install-dashboard /usr/app/node_modules  .
RUN npm install pm2 -g && \
    pm2 install pm2-metrics
CMD ["pm2-runtime","build/index.js"]


FROM nginx:alpine AS storybook
COPY --from=install-dashboard /usr/app/storybook-static /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

FROM scratch AS export-yarn-lock
COPY --from=install-dashboard /usr/app/yarn.lock /
