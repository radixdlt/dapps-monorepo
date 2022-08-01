FROM node:16
COPY . .

RUN yarn && yarn dev

EXPOSE 5173