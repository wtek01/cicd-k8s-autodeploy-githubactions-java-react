import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiService from "../services/api";

interface User {
  id: string;
  name: string;
  email: string;
}

interface Order {
  id: string;
  userId: string;
  productId: string;
  amount: number;
}

function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all orders
        const ordersData = (await apiService.getOrders()) as Order[];
        setOrders(ordersData);

        // Get unique user IDs from orders
        const userIds = [...new Set(ordersData.map((order) => order.userId))];

        // Fetch user details for each unique user ID
        const userMap: Record<string, string> = {};

        await Promise.all(
          userIds.map(async (userId: string) => {
            try {
              const userData = (await apiService.getUserById(userId)) as User;
              userMap[userId] = userData.name;
            } catch (err) {
              console.warn(`Could not fetch user ${userId}:`, err);
              userMap[userId] = "Unknown User";
            }
          })
        );

        setUsers(userMap);
        setError(null);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h2>Orders</h2>
        <Link to="/orders/create" className="button create-button">
          Create Order
        </Link>
      </div>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Product ID</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{users[order.userId] || "Unknown User"}</td>
                <td>{order.productId}</td>
                <td>${order.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Orders;
