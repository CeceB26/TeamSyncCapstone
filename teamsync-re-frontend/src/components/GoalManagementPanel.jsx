import { useEffect, useMemo, useState } from "react";
import { getGoals, deleteGoal } from "../services/dashboardService";
import CreateGoalForm from "./CreateGoalForm";

function GoalManagementPanel({ onRefresh }) {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingGoal, setEditingGoal] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [assignedUserFilter, setAssignedUserFilter] = useState("");

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const data = await getGoals();
      setGoals(data);
      setError("");
    } catch (err) {
      setError("Failed to load goals.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this goal?");
    if (!confirmed) return;

    try {
      await deleteGoal(id);
      setGoals((prev) => prev.filter((goal) => goal.id !== id));

      if (editingGoal?.id === id) {
        setEditingGoal(null);
      }

      if (onRefresh) onRefresh();
    } catch (err) {
      setError("Failed to delete goal.");
      console.error(err);
    }
  };

  const handleFormSuccess = async () => {
    await fetchGoals();
    setEditingGoal(null);
    if (onRefresh) onRefresh();
  };

  const uniqueAssignedUsers = useMemo(() => {
    const usersMap = new Map();

    goals.forEach((goal) => {
      if (goal.user?.id) {
        usersMap.set(goal.user.id, {
          id: goal.user.id,
          name: `${goal.user.firstName} ${goal.user.lastName}`,
        });
      }
    });

    return Array.from(usersMap.values());
  }, [goals]);

  const filteredGoals = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return goals.filter((goal) => {
      const matchesSearch =
        !term ||
        goal.title?.toLowerCase().includes(term) ||
        goal.description?.toLowerCase().includes(term);

      const matchesStatus =
        !statusFilter || goal.status === statusFilter;

      const matchesAssignedUser =
        !assignedUserFilter || String(goal.user?.id) === assignedUserFilter;

      return matchesSearch && matchesStatus && matchesAssignedUser;
    });
  }, [goals, searchTerm, statusFilter, assignedUserFilter]);

  return (
    <div className="dashboard-section" style={{ marginTop: "30px" }}>
      <h2>Goal Management</h2>

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
          <h3 style={{ marginTop: 0 }}>Goals</h3>

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
              placeholder="Search by title or description"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                gridColumn: "1 / -1",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc"
              }}
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
            >
              <option value="">All Statuses</option>
              <option value="NOT_STARTED">Not Started</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>

            <select
              value={assignedUserFilter}
              onChange={(e) => setAssignedUserFilter(e.target.value)}
              style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
            >
              <option value="">All Assigned Users</option>
              {uniqueAssignedUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          {loading && <p>Loading goals...</p>}
          {error && <p>{error}</p>}

          {!loading && !error && filteredGoals.length === 0 && (
            <div className="empty-state">
              <p><strong>No matching goals found.</strong></p>
              <p>Try adjusting your search or filters.</p>
            </div>
          )}

          {!loading && !error && filteredGoals.length > 0 && (
            <div style={{ display: "grid", gap: "12px" }}>
              {filteredGoals.map((goal) => {
                const isEditing = editingGoal?.id === goal.id;

                return (
                  <div
                    key={goal.id}
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

                    <p><strong>{goal.title}</strong></p>
                    <p>{goal.description}</p>

                    {goal.targetValue !== null && goal.targetValue !== undefined && (
                      <p>Target: {goal.targetValue}</p>
                    )}

                    {goal.currentValue !== null && goal.currentValue !== undefined && (
                      <p>Progress: {goal.currentValue}</p>
                    )}

                    {goal.dueDate && <p>Due Date: {goal.dueDate}</p>}

                    <p>Status: {goal.status}</p>

                    <p style={{ fontSize: "12px", color: "#666" }}>
                      Assigned to {goal.user?.firstName} {goal.user?.lastName}
                    </p>

                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                      <button
                        onClick={() => setEditingGoal(goal)}
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
                        onClick={() => handleDelete(goal.id)}
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
          <CreateGoalForm
            editingGoal={editingGoal}
            onSuccess={handleFormSuccess}
            onCancelEdit={() => setEditingGoal(null)}
          />
        </div>
      </div>
    </div>
  );
}

export default GoalManagementPanel;