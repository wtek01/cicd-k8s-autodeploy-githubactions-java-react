#!/bin/sh
# This is the entrypoint script for the frontend Docker container
# It runs when the container starts up and:
# 1. Generates runtime configuration from environment variables
# 2. Processes nginx config templates
# 3. Starts nginx
set -e

# Log environment for debugging
echo "Current environment: $ENVIRONMENT"
echo "API URL: $API_URL"
echo "User Service URL: $USER_SERVICE_URL"
echo "Order Service URL: $ORDER_SERVICE_URL"

# Generate the runtime configuration based on environment variables
# Default values are provided if environment variables are not set
cat <<EOF > /usr/share/nginx/html/config.js
window.__ENV = {
  // URLs for service communication
  API_URL: "${API_URL}",
  USER_SERVICE_URL: "${USER_SERVICE_URL}",
  ORDER_SERVICE_URL: "${ORDER_SERVICE_URL}",
  FRONTEND_URL: "${FRONTEND_URL}",
  
  // Environment information
  ENVIRONMENT: "${ENVIRONMENT}",
  VERSION: "${VERSION}"
};
console.log('Runtime configuration loaded:', window.__ENV);
EOF

# Process nginx template - replace environment variables in the nginx config
envsubst '${API_URL} ${USER_SERVICE_URL} ${ORDER_SERVICE_URL} ${FRONTEND_URL}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

# Execute the CMD from the Dockerfile (nginx -g daemon off;)
exec "$@" 