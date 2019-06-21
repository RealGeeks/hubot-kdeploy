FROM node:dubnium-stretch-slim

WORKDIR /opt/hubot-kdeploy

COPY package.json package-lock.json ./
RUN npm i --no-save

COPY bin ./bin
COPY src ./src
COPY tests ./tests
COPY .eslintrc ./.eslintrc
