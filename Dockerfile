FROM node:20-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .
COPY tsconfig.json ./
COPY src ./src
COPY scripts ./scripts

RUN npm install
RUN npm run build

COPY . .

ENV PORT=5500

CMD [ "node","dist/src/index.js" ]