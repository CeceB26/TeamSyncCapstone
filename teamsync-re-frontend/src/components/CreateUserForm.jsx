import { useEffect, useState } from "react";
import { createUser, updateUser } from "../services/dashboardService";

function CreateUserForm({ onSuccess, editingUser, onCancelEdit }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingUser) {
      setFirstName(editingUser.firstName || "");
      setLastName(editingUser.lastName || "");
      setEmail(editingUser.email || "");
      setPassword("");
      setRole(editingUser.role || "USER");
      setMessage("");
      setError("");
    }
  }, [editingUser]);

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setRole("USER");
    setMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!firstName.trim()) {
      setError("First name is required.");
      return;
    }

    if (!lastName.trim()) {
      setError("Last name is required.");
      return;
    }

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!editingUser && !password.trim()) {
      setError("Password is required when creating a user.");
      return;
    }

    const userData = {
      firstName,
      lastName,
      email,
      password: password.trim() ? password : null,
      role,
    };

    try {
      if (editingUser) {
        await updateUser(editingUser.id, userData);
        setMessage("User updated successfully.");
      } else {
        await createUser(userData);
        setMessage("User created successfully.");
      }

      resetForm();

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error("User submit error:", err);
      console.error("Response data:", err.response?.data);
      console.error("Status:", err.response?.status);
      console.error("Request URL:", err.config?.url);

      setError(
        err.response?.data?.message ||
          `Failed to ${editingUser ? "update" : "create"} user.`
      );
    }
  };

  const handleCancelEdit = () => {
    resetForm();
    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  return (
    <div className="dashboard-section">
      <h2>
        {editingUser
          ? `Editing: ${editingUser.firstName} ${editingUser.lastName}`
          : "Create User"}
      </h2>

      <form onSubmit={handleSubmit} className="form-layout">
        <label>
          First Name
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>

        <label>
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Password {editingUser ? "(leave blank to keep current password)" : ""}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={!editingUser}
          />
        </label>

        <label>
          Role
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
        </label>

        <button type="submit">
          {editingUser ? "Update User" : "Create User"}
        </button>

        {editingUser && (
          <button
            type="button"
            onClick={handleCancelEdit}
            style={{
              marginTop: "10px",
              backgroundColor: "#6b7280",
              color: "white",
              border: "none",
              padding: "8px 12px",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Cancel Edit
          </button>
        )}
      </form>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default CreateUserForm;