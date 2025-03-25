import config from "../config/env.config";

// API service for making requests to the backend
class ApiService {
  // Base URLs for different services
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.apiUrl;
    console.log(`ApiService initialized with base URL: ${this.baseUrl}`);
    console.log(`Running in ${config.environment} environment`);
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const defaultHeaders = {
      "Content-Type": "application/json",
    };

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  // User service methods
  async getUsers() {
    return this.request("/users");
  }

  async getUserById(id: string) {
    return this.request(`/users/${id}`);
  }

  async createUser(userData: any) {
    return this.request("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  // Order service methods
  async getOrders() {
    return this.request("/orders");
  }

  async getOrderById(id: string) {
    return this.request(`/orders/${id}`);
  }

  async createOrder(orderData: any) {
    return this.request("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  }
}

// Export a singleton instance
export default new ApiService();
