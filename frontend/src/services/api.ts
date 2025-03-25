import config from "../config/env";

// API Types
export interface UserData {
  id?: string;
  name: string;
  email: string;
  orderIds?: string[];
}

export interface OrderData {
  id?: string;
  userId: string;
  productId: string;
  amount: number;
  orderDate?: string;
  status?: string;
}

// Common response type
type ApiResponse<T> = Promise<T>;

/**
 * Centralized API service for communicating with backend microservices
 */
class ApiService {
  // Initialize with configuration
  constructor(
    private readonly userServiceUrl = config.userServiceUrl,
    private readonly orderServiceUrl = config.orderServiceUrl
  ) {
    console.log(`API Service initialized:
      - User Service: ${this.userServiceUrl}
      - Order Service: ${this.orderServiceUrl}
      - Environment: ${config.environment}
    `);
  }

  // Generic request method with strong typing
  private async request<T>(
    url: string,
    options: RequestInit = {}
  ): ApiResponse<T> {
    const defaultHeaders = {
      "Content-Type": "application/json",
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(
          `API request failed: ${response.status} ${response.statusText}`
        );
      }

      return (await response.json()) as T;
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
      throw error;
    }
  }

  // User Service API
  getUsers(): ApiResponse<UserData[]> {
    return this.request<UserData[]>(`${this.userServiceUrl}/users`);
  }

  getUserById(id: string): ApiResponse<UserData> {
    return this.request<UserData>(`${this.userServiceUrl}/users/${id}`);
  }

  createUser(userData: UserData): ApiResponse<UserData> {
    return this.request<UserData>(`${this.userServiceUrl}/users`, {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  // Order Service API
  getOrders(): ApiResponse<OrderData[]> {
    return this.request<OrderData[]>(`${this.orderServiceUrl}/orders`);
  }

  getOrderById(id: string): ApiResponse<OrderData> {
    return this.request<OrderData>(`${this.orderServiceUrl}/orders/${id}`);
  }

  createOrder(orderData: OrderData): ApiResponse<OrderData> {
    return this.request<OrderData>(`${this.orderServiceUrl}/orders`, {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  }
}

// Export a singleton instance
export default new ApiService();
