FROM nginx:latest
COPY nginx.conf /etc/nginx/nginx.conf
COPY public /var/www/blog/
