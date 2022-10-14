FROM node:lts-alpine as builder
WORKDIR /usr/src
COPY "package.json" "./"
COPY "package-lock.json" "./"
RUN npm install
RUN apk update && apk add --no-cache git
COPY . .
RUN chown -R node /usr/src
USER node
CMD ["npm", "run", "build-docker-prod"]

FROM node:lts-alpine
WORKDIR /usr/src
COPY "package.json" "./"
COPY "package-lock.json" "./"
RUN npm install --omit=dev
RUN apk update && apk add --no-cache git
COPY ./config /usr/src/config
COPY --from=builder /usr/src/dist /usr/src/dist
CMD ["npm", "run", "start-docker-prod"]

