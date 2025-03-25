import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiService from "../services/api";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await apiService.getUsers();
        setUsers(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to load users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="users-container">
      <div className="users-header">
        <h2>Users</h2>
        <Link to="/users/create" className="button create-button">
          Create User
        </Link>
      </div>

      {loading ? (
        <div className="loading">Loading users...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="users-grid">
          <div className="users-grid-header">
            <div className="grid-item">ID</div>
            <div className="grid-item">Name</div>
            <div className="grid-item">Email</div>
            <div className="grid-item">Orders</div>
            <div className="grid-item">Actions</div>
          </div>
          {users.length === 0 ? (
            <div className="no-data">No users found</div>
          ) : (
            users.map((user: any) => (
              <div className="users-grid-row" key={user.id}>
                <div className="grid-item">{user.id}</div>
                <div className="grid-item">{user.name}</div>
                <div className="grid-item">{user.email}</div>
                <div className="grid-item">{user.orderIds?.length || 0}</div>
                <div className="grid-item">
                  <Link to={`/users/${user.id}`} className="button view-button">
                    View
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Users;
