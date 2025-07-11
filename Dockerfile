# Stage 1: build app
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
COPY . .

RUN npm install
RUN npm run build

# Stage 2: serve with nginx
FROM nginx:alpine

# Копіюємо зібраний фронт
COPY --from=build /app/dist /usr/share/nginx/html

# Додаємо шаблон env.js
COPY public/env.js.template /usr/share/nginx/html/env.js.template

# Копіюємо шаблон конфігу та скрипт запуску
COPY nginx.conf.template /etc/nginx/conf.d/default.conf.template
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
