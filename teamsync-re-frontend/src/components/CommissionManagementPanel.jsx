import { useEffect, useMemo, useState } from "react";
import { getCommissions, deleteCommission } from "../services/dashboardService";
import CreateCommissionForm from "./CreateCommissionForm";

function CommissionManagementPanel({ onRefresh }) {
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingCommission, setEditingCommission] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [assignedUserFilter, setAssignedUserFilter] = useState("");

  const fetchCommissions = async () => {
    try {
      setLoading(true);
      const data = await getCommissions();
      setCommissions(data);
      setError("");
    } catch (err) {
      setError("Failed to load commissions.");
      console.error("Load commissions error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommissions();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this commission?");
    if (!confirmed) return;

    try {
      await deleteCommission(id);
      setCommissions((prev) => prev.filter((commission) => commission.id !== id));

      if (editingCommission?.id === id) {
        setEditingCommission(null);
      }

      if (onRefresh) onRefresh();
    } catch (err) {
      setError("Failed to delete commission.");
      console.error("Delete commission error:", err);
      console.error("Response data:", err.response?.data);
      console.error("Status:", err.response?.status);
      console.error("Request URL:", err.config?.url);
    }
  };

  const handleFormSuccess = async () => {
    await fetchCommissions();
    setEditingCommission(null);
    if (onRefresh) onRefresh();
  };

  const uniqueAssignedUsers = useMemo(() => {
    const usersMap = new Map();

    commissions.forEach((commission) => {
      if (commission.user?.id) {
        usersMap.set(commission.user.id, {
          id: commission.user.id,
          name: `${commission.user.firstName} ${commission.user.lastName}`,
        });
      }
    });

    return Array.from(usersMap.values());
  }, [commissions]);

  const filteredCommissions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return commissions.filter((commission) => {
      const matchesSearch =
        !term ||
        commission.transactionName?.toLowerCase().includes(term);

      const matchesAssignedUser =
        !assignedUserFilter || String(commission.user?.id) === assignedUserFilter;

      return matchesSearch && matchesAssignedUser;
    });
  }, [commissions, searchTerm, assignedUserFilter]);

  return (
    <div className="dashboard-section" style={{ marginTop: "30px" }}>
      <h2>Commission Management</h2>

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
          <h3 style={{ marginTop: 0 }}>Commissions</h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <input
              type="text"
              placeholder="Search by transaction name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />

            <select
              value={assignedUserFilter}
              onChange={(e) => setAssignedUserFilter(e.target.value)}
              style={{
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            >
              <option value="">All Assigned Users</option>
              {uniqueAssignedUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          {loading && <p>Loading commissions...</p>}
          {error && <p>{error}</p>}

          {!loading && !error && filteredCommissions.length === 0 && (
            <div className="empty-state">
              <p><strong>No matching commissions found.</strong></p>
              <p>Try adjusting your search or filters.</p>
            </div>
          )}

          {!loading && !error && filteredCommissions.length > 0 && (
            <div style={{ display: "grid", gap: "12px" }}>
              {filteredCommissions.map((commission) => {
                const isEditing = editingCommission?.id === commission.id;

                return (
                  <div
                    key={commission.id}
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

                    <p><strong>{commission.transactionName}</strong></p>
                    <p>Amount: ${Number(commission.amount || 0).toLocaleString()}</p>
                    {commission.closingDate && <p>Closing Date: {commission.closingDate}</p>}

                    <p style={{ fontSize: "12px", color: "#666" }}>
                      Assigned to {commission.user?.firstName} {commission.user?.lastName}
                    </p>

                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                      <button
                        onClick={() => setEditingCommission(commission)}
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

                      <button
                        onClick={() => handleDelete(commission.id)}
                        style={{
                          background: "#c62828",
                          color: "white",
                          border: "none",
                          padding: "8px 12px",
                          borderRadius: "6px",
                          cursor: "pointer"
                        }}
                      >
                        Delete
                      </button>
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
          <CreateCommissionForm
            editingCommission={editingCommission}
            onSuccess={handleFormSuccess}
            onCancelEdit={() => setEditingCommission(null)}
          />
        </div>
      </div>
    </div>
  );
}

export default CommissionManagementPanel;