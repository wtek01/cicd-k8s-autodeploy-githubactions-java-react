import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/" style={{ color: "white", textDecoration: "none" }}>
            Microservices Demo
          </Link>
        </div>
        <nav className="nav">
          <ul>
            <li>
              <Link to="/">Dashboard</Link>
            </li>
            <li>
              <Link to="/users">Users</Link>
            </li>
            <li>
              <Link to="/orders">Orders</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
