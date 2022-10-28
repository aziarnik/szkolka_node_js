FROM node:lts-alpine as base 
WORKDIR /usr/src
COPY "package.json" "./"
COPY "package-lock.json" "./"
RUN apk update && apk add --no-cache git

FROM base as builder-1
RUN npm install
COPY . .
COPY "wait-for.sh" "./"
RUN ["chmod", "+x", "./wait-for.sh"]

FROM builder-1 as builder-2
RUN ["npm", "run", "build-docker-prod"]

FROM base
RUN npm install --omit=dev
RUN mkdir -p ./config
RUN mkdir -p ./dist
COPY ./config ./config
COPY --from=builder-2 /usr/src/dist/. ./dist
COPY --from=builder-2 /usr/src/wait-for.sh /usr/src
RUN chown -R node /usr/src
USER node
CMD sh -c './wait-for.sh db:5432 -- npm run start-docker-prod'

