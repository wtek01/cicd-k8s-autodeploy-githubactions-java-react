# Frontend Environment Configuration

This project uses the Environment Variables at Container Runtime approach to manage configuration across different environments.

## How It Works

1. The frontend is built as a static bundle
2. The same bundle is deployed to all environments (local, docker, kubernetes)
3. Environment-specific configuration is injected at container startup
4. Nginx serves the static content and routes API requests

## Configuration Files

- `src/config/env.config.ts` - TypeScript configuration module
- `nginx/default.conf` - Nginx configuration template
- `docker-entrypoint.sh` - Script that generates runtime configuration

## Available Environments

- **Local Development**: For local development
- **Docker**: For running in docker-compose
- **Kubernetes**: For deployment to Kubernetes cluster

## Environment Variables

The following environment variables can be set:

| Variable    | Description              | Default               |
| ----------- | ------------------------ | --------------------- |
| API_URL     | Base URL for backend API | http://localhost:8080 |
| ENVIRONMENT | Current environment name | production            |
| VERSION     | Application version      | 1.0.0                 |

## Usage

### Local Development

```bash
npm run dev
```

### Docker Compose

```bash
docker-compose up
```

### Kubernetes

```bash
kubectl apply -f k8s/frontend-config.yml
kubectl apply -f k8s/frontend-deployment.yml
```

## How to Use the Configuration in Components

```typescript
import config from "../config/env.config";

// Access configuration values
console.log(config.apiUrl);
console.log(config.environment);
console.log(config.version);

// Check environment
if (config.isProduction) {
  // Production-specific code
}

if (config.isDevelopment) {
  // Development-specific code
}
```

## CI/CD Integration

The GitHub Actions workflow builds the frontend once and deploys it to different environments with appropriate configuration.
