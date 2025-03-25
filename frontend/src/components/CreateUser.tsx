import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/api";

function CreateUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await apiService.createUser({ name, email });

      // Redirect to users list after successful creation
      navigate("/users");
    } catch (err) {
      console.error("Error creating user:", err);
      setError("Failed to create user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Create New User</h2>
      </div>

      <div className="form-container">
        <h3 className="form-title">User Information</h3>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="button" disabled={loading}>
              {loading ? "Creating..." : "Create User"}
            </button>
            <button
              type="button"
              className="button secondary"
              onClick={() => navigate("/users")}
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

export default CreateUser;
