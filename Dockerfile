FROM nginx:latest

FROM node:latest

COPY nginx.conf /etc/nginx/nginx.conf
COPY . /var/www/blog/
WORKDIR /var/www/blog/
RUN  npm config set registry http://registry.npm.taobao.org \
    && npm install \ 
    && npm run build
