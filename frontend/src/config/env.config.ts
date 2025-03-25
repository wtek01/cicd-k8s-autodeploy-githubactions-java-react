// Define global window with __ENV property for TypeScript
declare global {
  interface Window {
    __ENV: {
      API_URL: string;
      ENVIRONMENT: string;
      VERSION: string;
    };
  }
}

// Environment configuration interface
export interface EnvironmentConfig {
  apiUrl: string;
  environment: string;
  version: string;
  isProduction: boolean;
  isDevelopment: boolean;
  isDocker: boolean;
  isKubernetes: boolean;
}

// Default configuration (fallbacks if window.__ENV is not available)
const defaultConfig = {
  API_URL: "http://localhost:8080",
  ENVIRONMENT: "development",
  VERSION: "1.0.0",
};

// Read configuration from window.__ENV injected by the container
const rawConfig =
  typeof window !== "undefined" && window.__ENV ? window.__ENV : defaultConfig;

// Create the configuration object with computed properties
const config: EnvironmentConfig = {
  apiUrl: rawConfig.API_URL,
  environment: rawConfig.ENVIRONMENT,
  version: rawConfig.VERSION,
  isProduction: rawConfig.ENVIRONMENT === "production",
  isDevelopment: rawConfig.ENVIRONMENT === "development",
  isDocker: rawConfig.ENVIRONMENT === "docker",
  isKubernetes: rawConfig.ENVIRONMENT === "kubernetes",
};

// Log configuration in development environments
if (config.isDevelopment) {
  console.log("Environment Config:", config);
}

export default config;
