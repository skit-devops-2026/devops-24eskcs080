FROM nginx:alpine
COPY *.html *.js *.css /usr/share/nginx/html/
COPY images/ /usr/share/nginx/html/images/
COPY data/ /usr/share/nginx/html/data/
EXPOSE 80
