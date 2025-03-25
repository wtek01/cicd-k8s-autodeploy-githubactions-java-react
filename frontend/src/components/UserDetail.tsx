import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import apiService, { OrderData, UserData } from "../services/api";

function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState<UserData | null>(null);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAndOrders = async () => {
      if (!id) return;

      try {
        setLoading(true);
        // Fetch user details
        const userData = await apiService.getUserById(id);
        setUser(userData);

        // If user has orders, fetch order details
        if (userData.orderIds && userData.orderIds.length > 0) {
          const orderPromises = userData.orderIds.map(async (orderId) => {
            try {
              return await apiService.getOrderById(orderId);
            } catch (err) {
              console.warn(`Could not fetch order ${orderId}:`, err);
              return null;
            }
          });

          const orderResults = await Promise.all(orderPromises);
          // Filter out any null results from failed requests
          setOrders(
            orderResults.filter((order): order is OrderData => order !== null)
          );
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching user details:", err);
        setError("Failed to load user details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndOrders();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading user details...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!user) {
    return <div className="error">User not found</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">User Details</h2>
        <Link to="/users" className="button secondary">
          Back to Users
        </Link>
      </div>

      <div className="form-container">
        <h3 className="form-title">{user.name}</h3>

        <div className="details-group">
          <p>
            <strong>ID:</strong> {user.id}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </div>

        <div className="orders-section">
          <h4>Orders ({user.orderIds ? user.orderIds.length : 0})</h4>

          {user.orderIds && user.orderIds.length > 0 ? (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Order ID</th>
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
                      <td>{order.productId}</td>
                      <td>${order.amount.toFixed(2)}</td>
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
          ) : (
            <p>No orders found for this user.</p>
          )}

          <div style={{ marginTop: "1rem" }}>
            <Link
              to="/orders/create"
              className="button"
              state={{ userId: user.id }}
            >
              Create New Order for This User
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDetail;
