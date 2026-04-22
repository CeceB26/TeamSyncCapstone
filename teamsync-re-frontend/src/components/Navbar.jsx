import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "null");

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h2 className="logo">TeamSync RE</h2>

      <div className="nav-links">
        {/* NOT LOGGED IN */}
        {!loggedInUser && (
          <Link to="/login">Login</Link>
        )}

        {/* USER */}
        {loggedInUser && loggedInUser.role === "USER" && (
          <Link to="/user">User Dashboard</Link>
        )}

        {/* ADMIN */}
        {loggedInUser && loggedInUser.role === "ADMIN" && (
          <>
            <Link to="/admin">Admin Dashboard</Link>
            <Link to="/user">User Dashboard</Link>
          </>
        )}

        {/* LOGOUT */}
        {loggedInUser && (
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;