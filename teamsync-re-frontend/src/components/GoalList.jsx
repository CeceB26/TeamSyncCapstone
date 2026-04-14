import { useEffect, useState } from "react";
import { getGoals, deleteGoal } from "../services/dashboardService";

function GoalList({ refreshKey }) {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const data = await getGoals();
        setGoals(data);
      } catch (err) {
        setError("Failed to load goals.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, [refreshKey]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this goal?");
    if (!confirmed) return;

    try {
      await deleteGoal(id);
      setGoals((prev) => prev.filter((goal) => goal.id !== id));
    } catch (err) {
      setError("Failed to delete goal.");
      console.error(err);
    }
  };

  if (loading) return <p>Loading goals...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="dashboard-section">
      <h2>Goals</h2>

      {goals.length > 0 ? (
        goals.map((goal) => (
          <div key={goal.id} className="item-card">
            <p><strong>{goal.title}</strong></p>
            <p>{goal.description}</p>

            {goal.targetValue !== null && goal.targetValue !== undefined && (
              <p>Target: {goal.targetValue}</p>
            )}

            {goal.currentValue !== null && goal.currentValue !== undefined && (
              <p>Progress: {goal.currentValue}</p>
            )}

            <p>Status: {goal.status}</p>

            <p style={{ fontSize: "12px", color: "#666" }}>
              Assigned to {goal.user?.firstName} {goal.user?.lastName}
            </p>

            <button
              onClick={() => handleDelete(goal.id)}
              style={{
                marginTop: "10px",
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
        ))
      ) : (
        <div className="empty-state">
          <p><strong>No goals yet.</strong></p>
          <p>Create a goal to track progress.</p>
        </div>
      )}
    </div>
  );
}

export default GoalList;