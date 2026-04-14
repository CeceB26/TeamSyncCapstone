import { useEffect, useState } from "react";
import { getAdminSummary } from "../services/dashboardService";
import SummaryCard from "../components/SummaryCard";
import EventManagementPanel from "../components/EventManagementPanel";
import CommissionManagementPanel from "../components/CommissionManagementPanel";
import AnnouncementManagementPanel from "../components/AnnouncementManagementPanel";
import PropertyManagementPanel from "../components/PropertyManagementPanel";
import GoalManagementPanel from "../components/GoalManagementPanel";
import CollapsiblePanel from "../components/CollapsiblePanel";

function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSummary = async () => {
    try {
      const data = await getAdminSummary();
      setSummary(data);
      setError("");
    } catch (err) {
      setError("Failed to load admin dashboard data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchSummary();
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

      <CollapsiblePanel title="Announcement Management" defaultOpen={true}>
        <AnnouncementManagementPanel onRefresh={handleRefresh} />
      </CollapsiblePanel>

      <CollapsiblePanel title="Goal Management">
        <GoalManagementPanel onRefresh={handleRefresh} />
      </CollapsiblePanel>

      <CollapsiblePanel title="Event Management">
        <EventManagementPanel onRefresh={handleRefresh} />
      </CollapsiblePanel>

      <CollapsiblePanel title="Commission Management">
        <CommissionManagementPanel onRefresh={handleRefresh} />
      </CollapsiblePanel>

      <CollapsiblePanel title="Property Management">
        <PropertyManagementPanel onRefresh={handleRefresh} />
      </CollapsiblePanel>
    </div>
  );
}

export default AdminDashboard;