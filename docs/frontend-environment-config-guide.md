# Frontend Environment Configuration Guide

## Problem Statement

Managing frontend access across multiple environments requires a consistent configuration approach to handle:

- Different backend API URLs per environment
- Environment-specific settings
- Proper routing and proxying
- Maintaining a clean, maintainable codebase

## Environments to Support

- **Local Development**: Running frontend and backends locally
- **Docker**: Running via docker-compose
- **Kubernetes**: Deployed to Kubernetes cluster with ingress

## Available Approaches

### 1. Build-time Environment Variables

**How it works:**

- Environment variables injected during build process
- Separate builds for each environment
- Configuration is baked into the build

**Implementation:**

- Environment-specific `.env` files
- Build flags for different environments
- Environment-specific Docker builds

**Pros:**

- Simple to implement
- Works well with static file hosting
- No runtime overhead

**Cons:**

- Requires rebuilding for config changes
- Multiple artifacts to manage
- Environment-specific builds can lead to subtle differences

### 2. Runtime Environment Variables

**How it works:**

- Build a single generic frontend bundle
- Inject environment variables at container startup
- Frontend reads configuration at runtime

**Implementation:**

- Container entrypoint script generates a configuration file
- Frontend loads this configuration on startup
- Single build works across environments

**Pros:**

- No rebuilding needed for config changes
- Single artifact for all environments
- Works well with container orchestration
- Industry standard approach

**Cons:**

- Requires a server component (not just static files)
- Slightly more complex container setup

### 3. API Gateway / BFF Pattern

**How it works:**

- Add an API Gateway layer
- Frontend communicates only with this gateway
- Gateway routes to appropriate backends

**Pros:**

- Frontend doesn't need environment awareness
- More backend flexibility
- Can add caching, aggregation

**Cons:**

- Additional service to maintain
- More complex architecture

### 4. Feature Flags / Config Management

**How it works:**

- Use dedicated configuration management services
- Frontend fetches configuration at runtime
- Supports dynamic configuration changes

**Pros:**

- Dynamic changes without deployments
- A/B testing capabilities
- Gradual feature rollouts

**Cons:**

- External dependency
- Additional costs
- More complex setup

## Recommended Approach: Environment Variables at Container Runtime

For a microservices architecture with Kubernetes, Docker, and local environments, the recommended approach is **Environment Variables at Container Runtime** using nginx.

### Concept Outline

#### 1. Core Concept

- Build frontend application **once** as a static bundle
- Deploy same bundle to all environments
- Inject environment-specific configuration at **container startup time**
- Use nginx as the web server with a startup script that generates configuration

#### 2. Key Components

**A. Frontend Application**

- Built as static assets (HTML, CSS, JS)
- Loads environment configuration from `window.__ENV` global object
- Uses TypeScript interface to provide type safety for configuration

**B. Nginx Container**

- Serves static frontend assets
- Includes startup script for configuration injection
- Proxies API requests to appropriate backend services

**C. Environment Configuration Script**

- Runs before nginx starts
- Generates JavaScript configuration with environment variables
- Places configuration file in nginx's static files directory

**D. Environment Variables**

- Passed to container at runtime
- Different values per environment
- Managed through:
  - Docker Compose environment section
  - Kubernetes ConfigMaps/Secrets
  - Local environment files

#### 3. Workflow

**Build Phase**

1. Frontend code is built into static assets
2. Container image is created with:
   - Static assets
   - Nginx configuration
   - Startup script

**Deployment Phase**

1. Same container image is deployed to all environments
2. Environment-specific variables are provided at deployment time
3. Container starts and startup script generates configuration
4. Frontend loads environment-specific configuration at runtime

#### 4. Configuration Flow

```
Environment Variables → Container → Startup Script → config.js → Frontend App
```

### System Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Frontend Container                           │
│                                                                     │
│   ┌─────────────┐          ┌───────────────────┐                    │
│   │             │          │                   │                    │
│   │  Entrypoint │          │  /usr/share/nginx/html                │
│   │   Script    │─────────▶│                   │                    │
│   │             │  writes  │  ┌─────────────┐  │                    │
│   └─────────────┘ config.js│  │ index.html  │  │                    │
│          ▲                 │  └─────────────┘  │                    │
│          │                 │                   │                    │
│          │                 │  ┌─────────────┐  │                    │
│   ┌─────────────┐         │  │   app.js    │  │                    │
│   │ Environment │         │  └─────────────┘  │                    │
│   │  Variables  │         │                   │                    │
│   │             │         │  ┌─────────────┐  │ ┌───────────────┐  │
│   │ API_URL     │         │  │  config.js  │◀─┼─┤ window.__ENV │  │
│   │ ENVIRONMENT │         │  │             │  │ │ Configuration │  │
│   └─────────────┘         │  └─────────────┘  │ └───────────────┘  │
│                           │                   │        ▲           │
│                           └───────────────────┘        │           │
│                                     ▲                  │           │
│                                     │                  │           │
│                           ┌───────────────────┐        │           │
│                           │                   │        │           │
│                           │  Nginx Webserver  │────────┘           │
│                           │                   │ serves              │
│                           └───────────────────┘                    │
│                                     │                              │
└─────────────────────────────────────┼──────────────────────────────┘
                                      │
                                      ▼
                            ┌───────────────────┐
                            │                   │
                            │   API Requests    │
                            │                   │
                            └───────────────────┘
                                      │
                                      ▼
                  ┌────────────────────────────────────┐
                  │                                    │
     ┌────────────┤          Backend Services         ├────────────┐
     │            │                                    │            │
     ▼            └────────────────────────────────────┘            ▼
┌──────────┐                                                  ┌──────────┐
│          │                                                  │          │
│ Service A │                                                  │ Service B │
│          │                                                  │          │
└──────────┘                                                  └──────────┘
```

The diagram shows:

1. **Environment Variables**: Provided to the container at runtime
2. **Entrypoint Script**: Runs at container startup and creates config.js
3. **Nginx Web Server**: Serves static content including the generated config
4. **Frontend Application**: Loads configuration from window.\_\_ENV
5. **API Requests**: Routed to appropriate backend services

### Why This Approach?

1. **Industry Standard**: Widely used in professional environments
2. **Operational Efficiency**: Single build artifact for all environments
3. **Flexibility**: Configuration changes without rebuilding
4. **Kubernetes Native**: Works well with ConfigMaps and Secrets
5. **Technology Agnostic**: Works with any backend technology (Spring Boot, Node.js, etc.)

### Implementation Details

#### 1. Frontend Configuration Module

Create a configuration module that reads environment variables from a global object:

```typescript
// src/config/env.config.ts
interface EnvironmentConfig {
  apiBaseUrl: string;
  environment: string;
}

const config: EnvironmentConfig = {
  apiBaseUrl: window.__ENV?.API_BASE_URL || "http://localhost:8080",
  environment: window.__ENV?.ENVIRONMENT || "development",
};

export default config;
```

#### 2. Container Entrypoint Script

Create a script that runs before nginx starts to generate the runtime configuration:

```bash
#!/bin/sh
# /docker-entrypoint.d/10-env-config.sh

# Generate runtime config with environment variables
cat <<EOF > /usr/share/nginx/html/config.js
window.__ENV = {
  API_BASE_URL: "${API_BASE_URL:-http://localhost:8080}",
  ENVIRONMENT: "${ENVIRONMENT:-production}"
};
EOF

# Execute the main container command (starting nginx)
exec "$@"
```

#### 3. Dockerfile

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Add environment configuration script
COPY docker-entrypoint.sh /docker-entrypoint.d/10-env-config.sh
RUN chmod +x /docker-entrypoint.d/10-env-config.sh

# Default environment variables
ENV API_BASE_URL=http://localhost:8080
ENV ENVIRONMENT=production

EXPOSE 80
```

#### 4. Nginx Configuration

```nginx
server {
    listen 80;
    server_name localhost;

    # Handle browser history routing
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests (environment-specific)
    location /api/ {
        proxy_pass ${API_BASE_URL}/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 5. Kubernetes Deployment

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: frontend-config
data:
  API_BASE_URL: "http://api.microservices.local"
  ENVIRONMENT: "production"
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
spec:
  replicas: 1
  template:
    spec:
      containers:
        - name: frontend
          image: your-frontend-image:tag
          envFrom:
            - configMapRef:
                name: frontend-config
```

#### 6. Docker Compose

```yaml
services:
  frontend:
    build:
      context: ./frontend
    environment:
      - API_BASE_URL=http://api:8080
      - ENVIRONMENT=docker
    ports:
      - "80:80"
```

### Development Workflow

1. **Local Development**: Use local environment config
2. **Docker Testing**: Deploy with docker environment variables
3. **Kubernetes Deployment**: Deploy same image with K8s ConfigMap

## Benefits of This Approach

1. **Single Build Artifact**: Build once, deploy anywhere
2. **Configuration Flexibility**: Change settings without rebuilds
3. **Technology Agnostic**: Works with any backend technology
4. **CI/CD Friendly**: Simplifies deployment pipelines
5. **Industry Standard**: Common approach in professional environments

## Summary

The Environment Variables at Container Runtime approach using nginx provides an optimal balance of simplicity, flexibility, and maintainability for managing frontend configurations across multiple environments. This approach is especially suitable for microservices architectures deployed to Kubernetes and is considered an industry standard practice in professional environments.

By implementing this approach, you'll have a clean, configurable frontend that can be deployed consistently across local, Docker, and Kubernetes environments without environment-specific builds.
