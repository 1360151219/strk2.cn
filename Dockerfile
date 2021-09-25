FROM nginx:latest
COPY public /var/www/blog/
WORKDIR /var/www/blog/
EXPOSE 8080
