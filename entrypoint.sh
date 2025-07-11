#!/bin/sh

# Підставляємо API_URL у env.js
envsubst '$API_URL' < /usr/share/nginx/html/env.js.template > /usr/share/nginx/html/env.js

# Запускаємо Nginx
exec nginx -g 'daemon off;'
