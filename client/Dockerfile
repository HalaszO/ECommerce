FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .

# based on the config, this will be overridden by the deployment
CMD ["npm", "run", "start"]