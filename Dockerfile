# build section
FROM node:18.20-alpine AS build
WORKDIR /build

COPY ./package.json .

RUN npm install --emit=env

COPY . .

RUN npm run build

# create server
FROM nginx:latest

COPY ./nginx.conf /etc/nginx/nginx.conf

COPY --from=build /build/dist /usr/share/nginx/html