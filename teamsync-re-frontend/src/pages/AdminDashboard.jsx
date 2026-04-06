import { useEffect, useState } from "react";
import { getAdminSummary } from "../services/dashboardService";
import SummaryCard from "../components/SummaryCard";
import CreateAnnouncementForm from "../components/CreateAnnouncementForm";
import CreateGoalForm from "../components/CreateGoalForm";
import CreateEventForm from "../components/CreateEventForm";
import CreateCommissionForm from "../components/CreateCommissionForm";
import CreatePropertyForm from "../components/CreatePropertyForm";

function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSummary = async () => {
    try {
      const data = await getAdminSummary();
      setSummary(data);
    } catch (err) {
      setError("Failed to load admin dashboard data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (loading) return <h2 className="page-message">Loading admin dashboard...</h2>;
  if (error) return <h2 className="page-message">{error}</h2>;

  return (
    <div className="page-container">
      <h1>Admin Dashboard</h1>

      <div className="card-grid">
        <SummaryCard title="Total Users" value={summary.totalUsers} />
        <SummaryCard title="Total Goals" value={summary.totalGoals} />
        <SummaryCard title="Total Announcements" value={summary.totalAnnouncements} />
        <SummaryCard title="Total Events" value={summary.totalEvents} />
        <SummaryCard title="Total Commissions" value={summary.totalCommissions} />
      </div>

   <h2 style={{ marginTop: "40px" }}>Admin Actions</h2>
      <div className="form-grid">
      <CreateAnnouncementForm onSuccess={fetchSummary} />
      <CreateGoalForm onSuccess={fetchSummary} />
      <CreateEventForm onSuccess={fetchSummary} />
      <CreateCommissionForm onSuccess={fetchSummary} />
      <CreatePropertyForm onSuccess={fetchSummary} />
     </div>
    </div>
  );
}

export default AdminDashboard;