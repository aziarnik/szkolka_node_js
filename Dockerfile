FROM node:lts-alpine
WORKDIR /usr/src
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install
RUN apk update && apk add --no-cache git
COPY . .
EXPOSE 4000
RUN chown -R node /usr/src
USER node
CMD ["npm", "run", "start-docker"]
