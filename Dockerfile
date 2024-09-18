FROM node:20-alpine

RUN apk add --no-cache bash

WORKDIR /app

COPY package*.json tsconfig.json src scripts ./
# COPY tsconfig.json ./
# COPY src ./src
# COPY scripts ./scripts

RUN npm install

COPY . .

RUN npm install -g ts-node-dev

EXPOSE 5500

CMD [ "node","dist/src/index.js" ]