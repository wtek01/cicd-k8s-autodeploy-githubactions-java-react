# k8s-autodeploy-githubactions-java-react

A complete CI/CD project demonstrating automated deployment of Java Spring Boot microservices and React frontend to Kubernetes using GitHub Actions.

## Project Structure

- **backend/**: Java Spring Boot microservices

  - **order-service/**: Microservice for order management
  - **user-service/**: Microservice for user management

- **frontend/**: React frontend application

  - **frontend/**: Main React application

- **infrastructure/**: All deployment and infrastructure configuration

  - **docker/**: Docker configuration including docker-compose
  - **k8s/**: Kubernetes manifests
  - **scripts/**: Deployment scripts and utilities

- **docs/**: Project documentation and guides

## Technologies

- **Backend**: Java, Spring Boot, Kafka
- **Frontend**: React
- **Infrastructure**: Kubernetes, Docker
- **CI/CD**: GitHub Actions

## Getting Started

(Add instructions for getting started with the project)

## License

(Add your license information here)

## CI/CD Kubernetes Auto-Deploy with GitHub Actions for Java/React

This project demonstrates a complete CI/CD pipeline using GitHub Actions to automatically build, test, and deploy a Java/React application to Kubernetes.

## Workflow Architecture

The CI/CD pipeline consists of two main workflows:

1. **Build and Publish**: Builds and tests the application, creates Docker images, and pushes them to Docker Hub.
2. **Deploy to Kubernetes**: Deploys the application to a Kubernetes cluster using the Docker images created by the first workflow.

## Feature Branch Support

The pipeline supports feature branches with the following pattern: `feature/*`. When you push changes to a feature branch:

1. The application is built and tested
2. Docker images are created with branch-specific tags
3. The application is deployed to a separate namespace in Kubernetes
4. Each feature branch gets its own isolated environment

## Prerequisites

To use this CI/CD pipeline, you need to set up the following:

### GitHub Secrets

Add the following secrets to your GitHub repository:

- `DOCKERHUB_USERNAME`: Your Docker Hub username
- `DOCKERHUB_TOKEN`: Your Docker Hub access token
- `PERSONAL_ACCESS_TOKEN`: A GitHub Personal Access Token with `workflow` scope

### Creating a Personal Access Token (PAT)

You need to create a Personal Access Token with the `workflow` scope to allow one workflow to trigger another. Here's how:

1. Go to your GitHub account settings
2. Select "Developer settings" from the left sidebar
3. Click on "Personal access tokens" → "Tokens (classic)"
4. Click "Generate new token" → "Generate new token (classic)"
5. Give your token a descriptive name, like "Workflow Dispatch Token"
6. Set an expiration date (or select "No expiration" if appropriate)
7. Select the `workflow` scope
8. Click "Generate token"
9. Copy the token and add it as a repository secret named `PERSONAL_ACCESS_TOKEN`

### Kubernetes Configuration

The self-hosted runner needs to have access to a Kubernetes cluster. The workflow assumes:

- kubectl is installed on the runner
- A kubeconfig file exists or is created during the workflow

## Using Feature Branches

To use a feature branch:

1. Create a new branch with the pattern `feature/your-feature-name`
2. Make your changes
3. Push to GitHub
4. The workflow will automatically build and deploy your feature branch
5. Access your feature deployment using the URLs shown in the workflow summary

## Accessing Feature Branch Deployments

Each feature branch is deployed to its own namespace with custom URLs:

- API: `http://api-feature-{feature-name}.microservices.local`
- Frontend: `http://frontend-feature-{feature-name}.microservices.local`

Add these hostnames to your hosts file to access the feature branch deployments locally:

```
127.0.0.1 api-feature-{feature-name}.microservices.local frontend-feature-{feature-name}.microservices.local
```

## Troubleshooting

If the deployment workflow is not triggered automatically after a build, you can:

1. Check if the `PERSONAL_ACCESS_TOKEN` secret is correctly set up
2. Manually trigger the deployment workflow from the GitHub Actions tab
3. Check the GitHub Actions logs for any errors
