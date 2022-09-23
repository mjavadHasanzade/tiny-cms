FROM node:lts-buster-slim AS base
RUN apt-get update && apt-get install libssl-dev ca-certificates -y
WORKDIR /app

COPY package.json package-lock.json ./

FROM base as build
RUN export NODE_ENV=production
RUN yarn install

COPY . .
RUN npm run prisma:generate
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]