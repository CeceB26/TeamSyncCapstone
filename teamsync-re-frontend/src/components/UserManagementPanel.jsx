import { useEffect, useMemo, useState } from "react";
import {
  getUsers,
  deactivateUser,
  reactivateUser
} from "../services/dashboardService";
import CreateUserForm from "./CreateUserForm";

function UserManagementPanel({ onRefresh }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
      setError("");
    } catch (err) {
      setError("Failed to load users.");
      console.error("Load users error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeactivate = async (id) => {
    const confirmed = window.confirm("Deactivate this user?");
    if (!confirmed) return;

    try {
      await deactivateUser(id);
      await fetchUsers();

      if (editingUser?.id === id) {
        setEditingUser(null);
      }

      if (onRefresh) onRefresh();
    } catch (err) {
      setError("Failed to deactivate user.");
      console.error("Deactivate user error:", err);
      console.error("Response data:", err.response?.data);
      console.error("Status:", err.response?.status);
    }
  };

  const handleReactivate = async (id) => {
    try {
      await reactivateUser(id);
      await fetchUsers();
      if (onRefresh) onRefresh();
    } catch (err) {
      setError("Failed to reactivate user.");
      console.error("Reactivate user error:", err);
      console.error("Response data:", err.response?.data);
      console.error("Status:", err.response?.status);
    }
  };

  const handleFormSuccess = async () => {
    await fetchUsers();
    setEditingUser(null);
    if (onRefresh) onRefresh();
  };

  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !term ||
        user.firstName?.toLowerCase().includes(term) ||
        user.lastName?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term);

      const matchesRole = !roleFilter || user.role === roleFilter;
      const matchesStatus = !statusFilter || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  return (
    <div className="dashboard-section" style={{ marginTop: "30px" }}>
      <h2>User Management</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: "24px",
          alignItems: "start",
        }}
      >
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "16px",
            backgroundColor: "#fff",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Users</h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <input
              type="text"
              placeholder="Search name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                gridColumn: "1 / -1",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
            >
              <option value="">All Roles</option>
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="DELETED">Deleted</option>
            </select>
          </div>

          {loading && <p>Loading users...</p>}
          {error && <p>{error}</p>}

          {!loading && !error && filteredUsers.length === 0 && (
            <div className="empty-state">
              <p><strong>No matching users found.</strong></p>
              <p>Try adjusting your search or filters.</p>
            </div>
          )}

          {!loading && !error && filteredUsers.length > 0 && (
            <div style={{ display: "grid", gap: "12px" }}>
              {filteredUsers.map((user) => {
                const isEditing = editingUser?.id === user.id;
                const isSuspended = user.status === "SUSPENDED";

                return (
                  <div
                    key={user.id}
                    className="item-card"
                    style={{
                      border: isEditing ? "2px solid #2563eb" : "1px solid #ddd",
                      backgroundColor: isEditing ? "#eff6ff" : "#fff",
                      borderRadius: "10px",
                      padding: "14px",
                      boxShadow: isEditing
                        ? "0 0 0 3px rgba(37, 99, 235, 0.15)"
                        : "0 1px 3px rgba(0,0,0,0.08)"
                    }}
                  >
                    {isEditing && (
                      <p style={{ color: "#1d4ed8", fontWeight: "bold", marginBottom: "8px" }}>
                        Currently Editing
                      </p>
                    )}

                    <p><strong>{user.firstName} {user.lastName}</strong></p>
                    <p>{user.email}</p>
                    <p>Role: {user.role}</p>
                    <p>Status: {user.status}</p>

                    <div style={{ display: "flex", gap: "10px", marginTop: "10px", flexWrap: "wrap" }}>
                      <button
                        onClick={() => setEditingUser(user)}
                        style={{
                          backgroundColor: isEditing ? "#1d4ed8" : "#2563eb",
                          color: "white",
                          border: "none",
                          padding: "8px 12px",
                          borderRadius: "6px",
                          cursor: "pointer"
                        }}
                      >
                        {isEditing ? "Editing" : "Edit"}
                      </button>

                      {!isSuspended ? (
                        <button
                          onClick={() => handleDeactivate(user.id)}
                          style={{
                            backgroundColor: "#c62828",
                            color: "white",
                            border: "none",
                            padding: "8px 12px",
                            borderRadius: "6px",
                            cursor: "pointer"
                          }}
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReactivate(user.id)}
                          style={{
                            backgroundColor: "#2e7d32",
                            color: "white",
                            border: "none",
                            padding: "8px 12px",
                            borderRadius: "6px",
                            cursor: "pointer"
                          }}
                        >
                          Reactivate
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "16px",
            backgroundColor: "#fff"
          }}
        >
          <CreateUserForm
            editingUser={editingUser}
            onSuccess={handleFormSuccess}
            onCancelEdit={() => setEditingUser(null)}
          />
        </div>
      </div>
    </div>
  );
}

export default UserManagementPanel;