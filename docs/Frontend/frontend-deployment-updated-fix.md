# Frontend Deployment Issue Resolution

## Understanding ConfigMaps in Kubernetes

### What is a ConfigMap?

A ConfigMap is a Kubernetes resource that allows you to decouple configuration details from container images. It stores non-sensitive configuration data in key-value pairs that can be consumed by pods in various ways:

- Environment variables
- Command-line arguments
- Configuration files in volumes

### Why Use ConfigMaps?

1. **Configuration Separation**

   - Keeps application code separate from configuration
   - Allows same container image to be used across different environments
   - Makes applications more portable and maintainable

2. **Easy Updates**

   - Configuration can be updated without rebuilding container images
   - Changes can be applied without restarting entire applications
   - Supports dynamic configuration management

3. **Environment-Specific Settings**
   - Different configurations for development, staging, and production
   - Service URLs can be customized per environment
   - Feature flags and application settings can be managed externally

### In Our Frontend Application

Our frontend ConfigMap (`frontend-configmap.yml`) manages several critical configurations:

```yaml
data:
  VITE_USER_SERVICE_URL: "http://user-service.microservices.svc.cluster.local"
  VITE_ORDER_SERVICE_URL: "http://order-service.microservices.svc.cluster.local"
  VITE_API_BASE_URL: "http://api-gateway.microservices.svc.cluster.local"
```

These configurations:

- Define service endpoints for microservices communication
- Enable environment-specific routing
- Allow for easy updates to service URLs without code changes

## Problem Description

The frontend deployment in the Kubernetes cluster was experiencing issues with two failed pods:

- `frontend-565994d59-h4xcc`: Status `InvalidImageName`
- `frontend-5975578497-h8pdr`: Status `ImagePullBackOff`

## Root Causes

1. **Invalid Image Name Configuration**

   - The deployment was using a templated version variable: `image: wtek01/frontend:${VERSION}`
   - The `${VERSION}` variable was not being properly substituted
   - This resulted in an invalid Docker image name

2. **ConfigMap Dependencies**
   - The deployment referenced environment variables from a ConfigMap named `frontend-config`
   - The ConfigMap needed to be properly configured with service URLs

## Solution Implementation

### 1. Frontend ConfigMap Configuration

Created/Updated the ConfigMap (`frontend-configmap.yml`) with proper service URLs:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: frontend-config
  namespace: microservices
data:
  VITE_USER_SERVICE_URL: "http://user-service.microservices.svc.cluster.local"
  VITE_ORDER_SERVICE_URL: "http://order-service.microservices.svc.cluster.local"
  VITE_API_BASE_URL: "http://api-gateway.microservices.svc.cluster.local"
```

### 2. Frontend Deployment Updates

Modified the deployment configuration (`frontend-deployment.yml`):

- Updated the image tag to use a specific version instead of the template variable
- Configured proper environment variable references
- Set up appropriate health checks and resource limits

Key changes:

```yaml
spec:
  template:
    spec:
      containers:
        - name: frontend
          image: wtek01/frontend:latest
          imagePullPolicy: Always
          envFrom:
            - configMapRef:
                name: frontend-config
```

## Results

After implementing these changes:

- The frontend pods successfully deployed
- The application correctly updates after each deployment
- Environment variables are properly configured
- Health checks are functioning as expected

## Best Practices Implemented

1. **Resource Management**

   - Defined CPU and memory limits
   - Set appropriate resource requests

2. **Health Monitoring**

   - Implemented startup probe
   - Configured liveness and readiness probes
   - Set reasonable timeout and failure thresholds

3. **Deployment Strategy**

   - Using RollingUpdate strategy
   - Configured maxSurge and maxUnavailable for zero-downtime deployments

4. **Environment Configuration**
   - Externalized configuration through ConfigMap
   - Properly structured service URLs
   - Clear separation of environment-specific variables

## Maintenance Notes

To update the frontend application:

1. Build and push a new Docker image
2. Apply any ConfigMap changes if needed:
   ```bash
   kubectl apply -f infrastructure/k8s/frontend-configmap.yml
   ```
3. Apply deployment changes:
   ```bash
   kubectl apply -f infrastructure/k8s/frontend-deployment.yml
   ```

The deployment will automatically roll out new changes while maintaining application availability.
