# Microservices Frontend Application

This is the frontend React application for the Microservices Demo project. It provides a web interface to interact with the user and order microservices.

## Features

- View and create users
- View user details including their orders
- Create orders for users
- Browse all orders in the system

## Technologies Used

- React 18
- React Router 6
- CSS for styling
- Nginx as the web server in production

## Development

### Prerequisites

- Node.js 16+ and npm

### Running Locally

1. Install dependencies:

   ```
   npm install
   ```

2. Start the development server:

   ```
   npm start
   ```

   The app will be available at http://localhost:3000

3. For local development, the API calls will be directed to `http://localhost:8080`. Make sure you have set up port forwarding to your Kubernetes services:
   ```
   kubectl port-forward svc/ingress-nginx-controller -n ingress-nginx 8080:80
   ```

### Building for Production

To build the application for production:

```
npm run build
```

This will create optimized production files in the `build` folder.

## Docker

### Building the Docker Image

```
docker build -t frontend:latest .
```

### Running the Docker Container

```
docker run -p 8080:80 frontend:latest
```

The application will be available at http://localhost:8080

## Deployment

This application is deployed to Kubernetes as part of the CI/CD pipeline. The deployment process:

1. Builds the React application
2. Creates a Docker image with the built app and Nginx
3. Pushes the image to DockerHub
4. Updates the Kubernetes manifest with the new image version
5. Deploys to the Kubernetes cluster

## Environment Configuration

The application automatically detects the environment:

- In development: API calls go to `http://localhost:8080`
- In production: API calls go to `http://api.microservices.local`

## Accessing the Application

Once deployed, the application is accessible at:

- http://app.microservices.local (when using the Ingress with a properly configured hosts file)

## Notes for Development

- Add `.env.local` for local environment variables if needed
- The application uses the React Router for navigation
- All API calls are relative to the base URL that's determined by the environment
