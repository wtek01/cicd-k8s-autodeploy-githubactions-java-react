// TypeScript declaration for window.__ENV
declare global {
  interface Window {
    __ENV: {
      API_URL: string;
      USER_SERVICE_URL: string;
      ORDER_SERVICE_URL: string;
      FRONTEND_URL: string;
      ENVIRONMENT: string;
      VERSION: string;
    };
  }
}

export {};
