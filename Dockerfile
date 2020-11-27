FROM node:12-alpine as build

WORKDIR /usr/app

COPY ./components ./components
COPY ./lib ./lib
COPY ./pages ./pages
COPY ./public ./public
COPY ./utils ./utils
COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm install --production
RUN npm run build

EXPOSE 3000
CMD ["node_modules/.bin/next", "start"]