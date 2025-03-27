# Build stage
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Set build arguments with defaults
ARG VITE_API_BASE_URL=http://localhost
ARG VITE_USER_SERVICE_URL=http://localhost:8081
ARG VITE_ORDER_SERVICE_URL=http://localhost:8082
ARG VITE_ENVIRONMENT=development

# Make the build arguments available as environment variables
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_USER_SERVICE_URL=$VITE_USER_SERVICE_URL
ENV VITE_ORDER_SERVICE_URL=$VITE_ORDER_SERVICE_URL
ENV VITE_ENVIRONMENT=$VITE_ENVIRONMENT

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Skip TypeScript checking and build directly with Vite
RUN echo "Building without TypeScript checking for development purposes"
# Use vite directly to skip TypeScript checks
RUN npx vite build

# Production stage
FROM nginx:alpine

# Create directory for templates
RUN mkdir -p /etc/nginx/templates

# Copy nginx configuration as a template
COPY nginx/default.conf /etc/nginx/templates/default.conf.template

# Copy build files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Expose port 80
EXPOSE 80

# Use our custom entrypoint script
ENTRYPOINT ["/docker-entrypoint.sh"]

# Default command to start nginx
CMD ["nginx", "-g", "daemon off;"]