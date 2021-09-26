FROM nginx:latest
COPY nginx.conf /etc/nginx/nginx.conf
RUN npm install \
    npm build \
    ls
COPY ./public /var/www/blog/
