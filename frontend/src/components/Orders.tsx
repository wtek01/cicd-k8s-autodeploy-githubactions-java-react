import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Orders({ apiBaseUrl }) {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState({}); // Map of user IDs to names
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all orders
        const ordersResponse = await fetch(`${apiBaseUrl}/orders`);
        if (!ordersResponse.ok) {
          throw new Error(
            `Error fetching orders: ${ordersResponse.statusText}`
          );
        }
        const ordersData = await ordersResponse.json();
        setOrders(ordersData);

        // Get unique user IDs from orders
        const userIds = [...new Set(ordersData.map((order) => order.userId))];

        // Fetch user details for each unique user ID
        const userMap = {};

        await Promise.all(
          userIds.map(async (userId) => {
            try {
              const userResponse = await fetch(`${apiBaseUrl}/users/${userId}`);
              if (userResponse.ok) {
                const userData = await userResponse.json();
                userMap[userId] = userData.name;
              } else {
                userMap[userId] = "Unknown User";
              }
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
  }, [apiBaseUrl]);

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Orders</h2>
        <Link to="/orders/create" className="button">
          Create New Order
        </Link>
      </div>

      {orders.length === 0 ? (
        <p>No orders found. Create a new order to get started.</p>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User</th>
                <th>Product</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>
                    <Link to={`/users/${order.userId}`}>
                      {users[order.userId] || "Unknown User"}
                    </Link>
                  </td>
                  <td>{order.productId}</td>
                  <td>${order.amount ? order.amount.toFixed(2) : "N/A"}</td>
                  <td>
                    {order.orderDate
                      ? new Date(order.orderDate).toLocaleString()
                      : "N/A"}
                  </td>
                  <td>{order.status || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Orders;
