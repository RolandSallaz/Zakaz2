FROM node:21-alpine
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .
RUN npm run build
CMD npm run migration:generate -n initMigration
CMD npm run migration:run
CMD [ "node", "dist/src/main.js" ]