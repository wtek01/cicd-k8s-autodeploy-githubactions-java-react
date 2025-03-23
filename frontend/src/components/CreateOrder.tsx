import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function CreateOrder({ apiBaseUrl }) {
  const [userId, setUserId] = useState("");
  const [productId, setProductId] = useState("");
  const [amount, setAmount] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Sample product list (in a real app, this would come from an API)
  const products = [
    { id: "prod-001", name: "Laptop", defaultPrice: 999.99 },
    { id: "prod-002", name: "Smartphone", defaultPrice: 699.99 },
    { id: "prod-003", name: "Headphones", defaultPrice: 149.99 },
    { id: "prod-004", name: "Monitor", defaultPrice: 299.99 },
    { id: "prod-005", name: "Keyboard", defaultPrice: 89.99 },
  ];

  // Fetch users for the dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setFetchingUsers(true);
        const response = await fetch(`${apiBaseUrl}/users`);

        if (!response.ok) {
          throw new Error(`Error fetching users: ${response.statusText}`);
        }

        const data = await response.json();
        setUsers(data);

        // If a userId was passed in location state, use it
        if (location.state && location.state.userId) {
          setUserId(location.state.userId);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users. Please try again later.");
      } finally {
        setFetchingUsers(false);
      }
    };

    fetchUsers();
  }, [apiBaseUrl, location.state]);

  // Update amount when product is selected
  useEffect(() => {
    if (productId) {
      const selectedProduct = products.find((p) => p.id === productId);
      if (selectedProduct) {
        setAmount(selectedProduct.defaultPrice.toString());
      }
    }
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId || !productId || !amount) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${apiBaseUrl}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          productId,
          amount: parseFloat(amount),
        }),
      });

      if (!response.ok) {
        throw new Error(`Error creating order: ${response.statusText}`);
      }

      // Redirect to orders list after successful creation
      navigate("/orders");
    } catch (err) {
      console.error("Error creating order:", err);
      setError("Failed to create order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingUsers) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Create New Order</h2>
      </div>

      <div className="form-container">
        <h3 className="form-title">Order Information</h3>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="userId">User</label>
            <select
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            >
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="productId">Product</label>
            <select
              id="productId"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              required
            >
              <option value="">Select a product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} (${product.defaultPrice.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="amount">Amount ($)</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
              min="0.01"
              placeholder="Enter amount"
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="button" disabled={loading}>
              {loading ? "Creating..." : "Create Order"}
            </button>
            <button
              type="button"
              className="button secondary"
              onClick={() => navigate("/orders")}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateOrder;
