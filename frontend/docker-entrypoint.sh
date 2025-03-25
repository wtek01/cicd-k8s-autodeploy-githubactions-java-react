#!/bin/sh
# This is the entrypoint script for the frontend Docker container
# It runs when the container starts up and:
# 1. Generates runtime configuration from environment variables
# 2. Processes nginx config templates
# 3. Starts nginx
set -e

# Generate the runtime configuration based on environment variables
# Default values are provided if environment variables are not set
cat <<EOF > /usr/share/nginx/html/config.js
window.__ENV = {
  // URLs for service communication
  API_URL: "${API_URL:-http://localhost}",
  USER_SERVICE_URL: "${USER_SERVICE_URL:-http://localhost:8081}",
  ORDER_SERVICE_URL: "${ORDER_SERVICE_URL:-http://localhost:8082}",
  FRONTEND_URL: "${FRONTEND_URL:-http://docker.frontend.com}",
  
  // Environment information
  ENVIRONMENT: "${ENVIRONMENT:-docker}",
  VERSION: "${VERSION:-1.0.0}"
};
console.log('Runtime configuration loaded:', window.__ENV);
EOF

# Process nginx template - replace environment variables in the nginx config
envsubst '${API_URL} ${USER_SERVICE_URL} ${ORDER_SERVICE_URL} ${FRONTEND_URL}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

# Execute the CMD from the Dockerfile (nginx -g daemon off;)
exec "$@" 