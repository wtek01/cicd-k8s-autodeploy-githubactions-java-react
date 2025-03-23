import { useEffect, useState } from "react";
import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import CreateOrder from "./components/CreateOrder";
import CreateUser from "./components/CreateUser";
import Header from "./components/Header";
import Orders from "./components/Orders";
import UserDetail from "./components/UserDetail";
import Users from "./components/Users";

function App() {
  const [apiBaseUrl, setApiBaseUrl] = useState(
    "http://api.microservices.local"
  );

  // For local development, check if we should use localhost instead
  useEffect(() => {
    // In development mode, use localhost with port forwarding
    if (process.env.NODE_ENV === "development") {
      setApiBaseUrl("http://localhost:8080");
    }
  }, []);

  return (
    <Router>
      <div className="app">
        <Header />
        <main className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<Users apiBaseUrl={apiBaseUrl} />} />
            <Route
              path="/users/create"
              element={<CreateUser apiBaseUrl={apiBaseUrl} />}
            />
            <Route
              path="/users/:id"
              element={<UserDetail apiBaseUrl={apiBaseUrl} />}
            />
            <Route
              path="/orders"
              element={<Orders apiBaseUrl={apiBaseUrl} />}
            />
            <Route
              path="/orders/create"
              element={<CreateOrder apiBaseUrl={apiBaseUrl} />}
            />
          </Routes>
        </main>
        <footer className="footer">
          <p>Microservices Demo &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    </Router>
  );
}

function Dashboard() {
  return (
    <div className="dashboard">
      <h2>Welcome to Microservices Dashboard</h2>
      <div className="dashboard-cards">
        <div className="card">
          <h3>Users</h3>
          <p>Manage users in the system</p>
          <Link to="/users" className="button">
            View Users
          </Link>
        </div>
        <div className="card">
          <h3>Orders</h3>
          <p>Manage orders in the system</p>
          <Link to="/orders" className="button">
            View Orders
          </Link>
        </div>
      </div>
    </div>
  );
}

export default App;
