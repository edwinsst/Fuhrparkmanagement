FROM node:latest AS builder

WORKDIR ./app

COPY package-lock.json package.json ./

RUN npm install -g @angular/cli@16
RUN npm ci

FROM builder AS runtime

RUN npm build
RUN npm start
