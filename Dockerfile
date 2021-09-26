FROM nginx:latest
COPY nginx.conf /etc/nginx/nginx.conf
COPY . /var/www/blog/
WORKDIR /var/www/blog/
RUN npm install \ 
    && npm build
