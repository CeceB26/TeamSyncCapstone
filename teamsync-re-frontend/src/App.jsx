import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import "./index.css";

function getLoggedInUser() {
  return JSON.parse(localStorage.getItem("loggedInUser") || "null");
}

function ProtectedUserRoute({ children }) {
  const loggedInUser = getLoggedInUser();

  if (!loggedInUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function ProtectedAdminRoute({ children }) {
  const loggedInUser = getLoggedInUser();

  if (!loggedInUser) {
    return <Navigate to="/login" replace />;
  }

  if (loggedInUser.role !== "ADMIN") {
    return <Navigate to="/user" replace />;
  }

  return children;
}

function AppLayout() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/" || location.pathname === "/login";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/user"
          element={
            <ProtectedUserRoute>
              <UserDashboard />
            </ProtectedUserRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;