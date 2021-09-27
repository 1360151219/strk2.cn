
FROM node:latest as builder
COPY . .
RUN npm config set -g registry https://registry.npm.taobao.org
RUN npm install

RUN npm run build

FROM nginx:alpine as server

COPY --from=builder nginx.conf /etc/nginx/nginx.conf
COPY --from=builder public /var/www/blog/
WORKDIR /var/www/blog/
# FROM nginx:latest
# COPY nginx.conf /etc/nginx/nginx.conf
# COPY public /var/www/blog/