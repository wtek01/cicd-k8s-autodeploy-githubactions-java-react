/**
 * Environment configuration for the frontend application
 */
import developmentConfig from "./environments/development";
import dockerConfig from "./environments/docker";
import kubernetesConfig from "./environments/kubernetes";
import productionConfig from "./environments/production";

type Environment = "development" | "production" | "docker" | "kubernetes";

// Read configuration from import.meta.env (Vite's environment variables)
const env = import.meta.env;

// Runtime configuration from window.__ENV (injected by docker-entrypoint.sh)
const runtimeConfig =
  typeof window !== "undefined" && window.__ENV
    ? {
        USER_SERVICE_URL: window.__ENV.USER_SERVICE_URL,
        ORDER_SERVICE_URL: window.__ENV.ORDER_SERVICE_URL,
        FRONTEND_URL: window.__ENV.FRONTEND_URL,
        ENVIRONMENT: window.__ENV.ENVIRONMENT as Environment | undefined,
      }
    : {
        USER_SERVICE_URL: undefined as string | undefined,
        ORDER_SERVICE_URL: undefined as string | undefined,
        FRONTEND_URL: undefined as string | undefined,
        ENVIRONMENT: undefined as Environment | undefined,
      };

interface Config {
  // Service URLs
  userServiceUrl: string;
  orderServiceUrl: string;
  frontendUrl: string;

  // Environment info
  environment: Environment;
  isDevelopment: boolean;
  isProduction: boolean;
  isDocker: boolean;
  isKubernetes: boolean;
}

// Determine current environment
const currentEnv = (runtimeConfig.ENVIRONMENT ||
  env.VITE_ENVIRONMENT ||
  "development") as Environment;

// Environment-specific configuration map
const configMap = {
  development: developmentConfig,
  docker: dockerConfig,
  kubernetes: kubernetesConfig,
  production: productionConfig,
};

// Create configuration with priority:
// 1. Runtime environment variables (window.__ENV)
// 2. Build-time environment variables (import.meta.env)
// 3. Environment-specific defaults
const config: Config = {
  // Service URLs with override priority
  userServiceUrl:
    runtimeConfig.USER_SERVICE_URL ||
    env.VITE_USER_SERVICE_URL ||
    configMap[currentEnv].userServiceUrl,

  orderServiceUrl:
    runtimeConfig.ORDER_SERVICE_URL ||
    env.VITE_ORDER_SERVICE_URL ||
    configMap[currentEnv].orderServiceUrl,

  frontendUrl:
    runtimeConfig.FRONTEND_URL ||
    env.VITE_FRONTEND_URL ||
    configMap[currentEnv].frontendUrl,

  // Environment
  environment: currentEnv,

  // Convenience flags
  get isDevelopment() {
    return this.environment === "development";
  },
  get isProduction() {
    return this.environment === "production";
  },
  get isDocker() {
    return this.environment === "docker";
  },
  get isKubernetes() {
    return this.environment === "kubernetes";
  },
};

// Log the configuration in non-production environments
if (config.environment !== "production") {
  console.log("Environment Config:", config);
}

export default config;
