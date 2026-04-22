import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "null");

    if (loggedInUser?.role === "ADMIN") {
      navigate("/admin", { replace: true });
    } else if (loggedInUser?.role === "USER") {
      navigate("/user", { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const completeLogin = (data) => {
    localStorage.setItem("loggedInUser", JSON.stringify(data));

    if (data.role === "ADMIN") {
      navigate("/admin", { replace: true });
    } else {
      navigate("/user", { replace: true });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Invalid email or password");
      }

      const data = await response.json();
      completeLogin(data);
    } catch (err) {
      console.error(err);
      setError("Login failed. Please check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (email, password) => {
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Demo login failed");
      }

      const data = await response.json();
      completeLogin(data);
    } catch (err) {
      console.error(err);
      setError("Demo login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>TeamSync Login</h1>
        <p style={subtitleStyle}>Sign in to access your dashboard</p>

        <form onSubmit={handleLogin} style={formStyle}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            style={inputStyle}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            style={inputStyle}
            required
          />

          {error && <p style={errorStyle}>{error}</p>}

          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? "Signing In..." : "Login"}
          </button>
        </form>

        <div style={demoSectionStyle}>
          <p style={demoTitleStyle}>Demo Access for Presentation</p>

          <div style={demoButtonRowStyle}>
            <button
              type="button"
              style={demoButtonStyle}
              onClick={() => handleDemoLogin("admin@test.com", "Test123!")}
              disabled={loading}
            >
              Login as Admin
            </button>

            <button
              type="button"
              style={demoButtonStyle}
              onClick={() => handleDemoLogin("user@test.com", "Test123!")}
              disabled={loading}
            >
              Login as User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#f4f7fb",
  padding: "24px",
  fontFamily: "Arial, sans-serif",
};

const cardStyle = {
  width: "100%",
  maxWidth: "420px",
  background: "#ffffff",
  borderRadius: "16px",
  padding: "32px",
  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.10)",
};

const titleStyle = {
  margin: "0 0 8px 0",
  fontSize: "30px",
  fontWeight: "700",
  color: "#111827",
};

const subtitleStyle = {
  margin: "0 0 24px 0",
  color: "#6b7280",
  fontSize: "14px",
};

const formStyle = {
  display: "grid",
  gap: "14px",
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  fontSize: "14px",
  boxSizing: "border-box",
};

const buttonStyle = {
  border: "none",
  background: "#1d4ed8",
  color: "#ffffff",
  padding: "12px 18px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "600",
};

const errorStyle = {
  margin: 0,
  color: "#b91c1c",
  fontSize: "14px",
};

const demoSectionStyle = {
  marginTop: "20px",
  paddingTop: "16px",
  borderTop: "1px solid #e5e7eb",
};

const demoTitleStyle = {
  fontSize: "13px",
  color: "#6b7280",
  marginBottom: "10px",
  textAlign: "center",
};

const demoButtonRowStyle = {
  display: "flex",
  gap: "10px",
};

const demoButtonStyle = {
  flex: 1,
  border: "1px solid #1d4ed8",
  background: "#ffffff",
  color: "#1d4ed8",
  padding: "10px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "600",
};

export default Login;