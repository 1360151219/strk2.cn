FROM nginx:latest
COPY nginx.conf /etc/nginx/nginx.conf
RUN npm install \
    npm run build
COPY public /var/www/blog/
