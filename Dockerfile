# FROM nginx:latest

# FROM node:latest

# COPY nginx.conf /etc/nginx/nginx.conf
# COPY . /var/www/blog/
# WORKDIR /var/www/blog/
# RUN npm install -g cnpm --registry=https://registry.npm.taobao.org \
#     && npm install \ 
#     && npm run build
FROM nginx:latest
COPY nginx.conf /etc/nginx/nginx.conf
COPY public /var/www/blog/