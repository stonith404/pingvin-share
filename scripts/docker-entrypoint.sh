#!/bin/sh

# Copy default logo to the frontend public folder if it doesn't exist
cp -rn /tmp/img/* /opt/app/frontend/public/img

# Start Caddy
caddy start --config /etc/caddy/Caddyfile &
# Run the frontend server
PORT=3333 HOSTNAME=0.0.0.0 node frontend/server.js &
# Run the backend server
cd backend && npm run prod
# Wait for all processes to finish
wait -n
