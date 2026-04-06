import { useEffect, useState } from "react";
import { getUserDashboard } from "../services/dashboardService";


function UserDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(1);

  const handleDeleteGoal = async (id) => {
  try {
    await fetch(`http://localhost:8080/api/goals/${id}`, {
      method: "DELETE",
    });

    const updated = await getUserDashboard(userId);
    setDashboard(updated);
  } catch (err) {
    console.error("Delete failed", err);
  }
};

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
       const data = await getUserDashboard(userId);
        setDashboard(data);
      } catch (err) {
        setError("Failed to load user dashboard data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!dashboard) return null;

  return (
    <div className="page-container">
  <div>
    <h1>User Dashboard</h1>

  <select
  value={userId}
  onChange={(e) => setUserId(Number(e.target.value))}
  style={{ marginBottom: "20px", padding: "8px" }}
>
  <option value={1}>Cece Beck</option>
  <option value={2}>User 2</option>
</select>
  </div>

      <div className="user-grid">
   <div className="dashboard-section">
  <h2>My Goals</h2>

  {dashboard.goals.length > 0 ? (
    dashboard.goals.map((goal) => (
      <div key={goal.id} className="item-card">
        <p><strong>{goal.title}</strong></p>
        <p>{goal.description}</p>

        <p
          style={{
            color:
              goal.status === "COMPLETED"
                ? "green"
                : goal.status === "IN_PROGRESS"
                ? "orange"
                : "gray",
          }}
        >
          Status: {goal.status}
        </p>

        <p>
          Progress: {goal.currentValue} / {goal.targetValue}
        </p>

        <div
          style={{
            background: "#eee",
            borderRadius: "6px",
            height: "8px",
            marginTop: "6px",
          }}
        >
          <div
            style={{
              width: `${(goal.currentValue / goal.targetValue) * 100}%`,
              background: "#4caf50",
              height: "100%",
              borderRadius: "6px",
            }}
          />
        </div>

        <button
          onClick={() => handleDeleteGoal(goal.id)}
          style={{
            marginTop: "12px",
            background: "#c62828",
            color: "white",
            border: "none",
            padding: "8px 12px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Delete Goal
        </button>
      </div>
    ))
  ) : (
    <div className="empty-state">
      <p><strong>No goals added yet.</strong></p>
      <p>"A goal without a plan is just a wish." — Antoine de Saint-Exupéry</p>
    </div>
  )}
</div>

        <div className="dashboard-section">
          <h2>My Commissions</h2>
          {dashboard.commissions.map((commission) => (
            <div key={commission.id} className="item-card">
              <p><strong>{commission.transactionName}</strong></p>
              <p>${commission.amount}</p>
              <p>{commission.closingDate}</p>
            </div>
          ))}
        </div>

        <div className="dashboard-section">
          <h2>Announcements</h2>
          {dashboard.announcements.map((announcement) => (
            <div key={announcement.id} className="item-card">
              <p><strong>{announcement.title}</strong></p>
              <p>{announcement.content}</p>
            </div>
          ))}
        </div>

        <div className="dashboard-section">
          <h2>Upcoming Events</h2>
          {dashboard.events.map((event) => (
            <div key={event.id} className="item-card">
              <p><strong>{event.title}</strong></p>
              <p>{event.eventDate}</p>
              <p>{event.location}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;