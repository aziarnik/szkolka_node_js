FROM node:lts-alpine as base 
WORKDIR /usr/src
COPY "package.json" "./"
COPY "package-lock.json" "./"
RUN apk update && apk add --no-cache git

FROM base as builder
RUN npm install
COPY . .
COPY "wait-for.sh" "./"
RUN ["chmod", "+x", "./wait-for.sh"]
CMD ["npm", "run", "build-docker-prod"]

FROM base
RUN npm install --omit=dev
COPY ./config /usr/src/config
COPY --from=builder /usr/src/dist /usr/src/dist
COPY --from=builder "./usr/src/wait-for.sh" "./"
RUN chown -R node /usr/src
USER node
CMD sh -c './wait-for.sh db:5432 -- npm run start-docker-prod'

