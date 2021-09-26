FROM nginx:latest

COPY nginx.conf /etc/nginx/nginx.conf
COPY . /var/www/blog/

WORKDIR /var/www/blog/
RUN apt-get update \
    && apt-get install -y nodejs \
    && npm install -g cnpm --registry=https://registry.npm.taobao.org \
    && npm install \ 
    && npm run build
