FROM node:lts-alpine as base 
WORKDIR /usr/src
COPY "package.json" "./"
COPY "package-lock.json" "./"
RUN apk update && apk add --no-cache git

FROM base as builder
RUN npm install
COPY . .
CMD ["npm", "run", "build-docker-prod"]

FROM base
RUN npm install --omit=dev
COPY ./config /usr/src/config
COPY --from=builder /usr/src/dist /usr/src/dist
RUN chown -R node /usr/src
USER node
CMD ["npm", "run", "start-docker-prod"]

