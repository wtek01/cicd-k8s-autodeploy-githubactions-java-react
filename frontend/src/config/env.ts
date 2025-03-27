/**
 * Environment configuration for the frontend application
 */
import developmentConfig from "./environments/development";
import dockerConfig from "./environments/docker";
import kubernetesConfig from "./environments/kubernetes";
import productionConfig from "./environments/production";
import type { Environment, RuntimeConfig } from "./types";

// Read configuration from import.meta.env (Vite's environment variables)
const env = import.meta.env;

// Runtime configuration from window.__ENV (injected by docker-entrypoint.sh)
const runtimeConfig: RuntimeConfig =
  typeof window !== "undefined" && window.__ENV ? window.__ENV : {};

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
const currentEnv = (env.VITE_ENVIRONMENT ||
  runtimeConfig.ENVIRONMENT ||
  "development") as Environment;

// Environment-specific configuration map
const configMap = {
  development: developmentConfig,
  docker: dockerConfig,
  kubernetes: kubernetesConfig,
  production: productionConfig,
} as const;

// Create configuration with priority:
// 1. Build-time environment variables (import.meta.env)
// 2. Runtime environment variables (window.__ENV)
// 3. Environment-specific defaults
const config: Config = {
  // Service URLs with override priority
  userServiceUrl:
    env.VITE_USER_SERVICE_URL ||
    runtimeConfig.USER_SERVICE_URL ||
    configMap[currentEnv].userServiceUrl,

  orderServiceUrl:
    env.VITE_ORDER_SERVICE_URL ||
    runtimeConfig.ORDER_SERVICE_URL ||
    configMap[currentEnv].orderServiceUrl,

  frontendUrl:
    env.VITE_FRONTEND_URL ||
    runtimeConfig.FRONTEND_URL ||
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
  console.log("Current Environment:", currentEnv);
  console.log("Vite Environment Variables:", {
    VITE_ENVIRONMENT: env.VITE_ENVIRONMENT,
    VITE_USER_SERVICE_URL: env.VITE_USER_SERVICE_URL,
    VITE_ORDER_SERVICE_URL: env.VITE_ORDER_SERVICE_URL,
  });
  console.log("Runtime Config:", runtimeConfig);
}

export default config;
