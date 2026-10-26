# Stage 1: build the React dashboard
FROM node:22-alpine AS dashboard-build
WORKDIR /dashboard
COPY dashboard/package*.json ./
RUN npm ci
COPY dashboard/ ./
RUN npm run build

# Stage 2: serve static pages plus the built dashboard with nginx
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY *.html *.js *.css /usr/share/nginx/html/
COPY images/ /usr/share/nginx/html/images/
COPY data/ /usr/share/nginx/html/data/
COPY --from=dashboard-build /dashboard/dist/ /usr/share/nginx/html/app/
EXPOSE 80
