import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <h2 className="logo">TeamSync RE</h2>
      <div className="nav-links">
        <Link to="/admin">Admin Dashboard</Link>
        <Link to="/user">User Dashboard</Link>
      </div>
    </nav>
  );
}

export default Navbar;