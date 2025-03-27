export type Environment =
  | "development"
  | "production"
  | "docker"
  | "kubernetes";

export interface RuntimeConfig {
  USER_SERVICE_URL?: string;
  ORDER_SERVICE_URL?: string;
  FRONTEND_URL?: string;
  ENVIRONMENT?: Environment;
  API_URL?: string;
  VERSION?: string;
}

declare global {
  interface Window {
    __ENV: RuntimeConfig;
  }
}
