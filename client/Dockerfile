FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .

# based on the config, this will be overridden by the deployment
# different script runs for each env, default: dev
ARG CMD_ARG=dev
ENV CMD_ARG=${CMD_ARG}

CMD npm run ${CMD_ARG}