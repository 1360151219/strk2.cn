
FROM node:latest as builder
WORKDIR /var/www/blog/
COPY . /var/www/blog/
RUN npm config set -g registry https://registry.npm.taobao.org
RUN npm install

RUN npm run build

FROM nginx:alpine as server

COPY --from=builder nginx.conf /etc/nginx/nginx.conf
# FROM nginx:latest
# COPY nginx.conf /etc/nginx/nginx.conf
# COPY public /var/www/blog/