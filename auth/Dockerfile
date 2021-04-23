FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm install --only=prod
COPY . .

ARG CMD_ARG=start
ENV CMD_ARG=${CMD_ARG}

CMD npm run ${CMD_ARG}