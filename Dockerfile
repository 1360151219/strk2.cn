FROM nginx:latest
COPY public /var/www/blog/
EXPOSE 4000
