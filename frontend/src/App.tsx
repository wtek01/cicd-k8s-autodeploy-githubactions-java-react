import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import CreateOrder from "./components/CreateOrder";
import CreateUser from "./components/CreateUser";
import EnvironmentIndicator from "./components/EnvironmentIndicator";
import Header from "./components/Header";
import Orders from "./components/Orders";
import UserDetail from "./components/UserDetail";
import Users from "./components/Users";
import "./services/api"; // Importer le service API pour s'assurer qu'il est initialisé

function Dashboard() {
  return (
    <div className="dashboard">
      <h2>Welcome to the Microservices Demo</h2>
      <div className="dashboard-links">
        <Link to="/users" className="dashboard-link">
          Manage Users Mohamed 4444
        </Link>
        <br />
        <Link to="/orders" className="dashboard-link">
          Manage Orders
        </Link>
      </div>

      {/* Uncomment to show environment debug information */}
      {/* <EnvDebug /> */}
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/create" element={<CreateUser />} />
            <Route path="/users/:id" element={<UserDetail />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/create" element={<CreateOrder />} />
          </Routes>
        </main>
        <footer className="footer">
          <p>Microservices Demo &copy; {new Date().getFullYear()}</p>
        </footer>
        <EnvironmentIndicator />
      </div>
    </Router>
  );
}

export default App;
