FROM nginx:latest
COPY nginx.conf /etc/nginx/nginx.conf
COPY public /var/www/blog/
WORKDIR /var/www/blog/
EXPOSE 8080
