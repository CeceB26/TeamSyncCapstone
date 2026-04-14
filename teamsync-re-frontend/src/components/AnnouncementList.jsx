import { useEffect, useState } from "react";
import { getAnnouncements, deleteAnnouncement } from "../services/dashboardService";

function AnnouncementList({ refreshKey }) {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await getAnnouncements();
        setAnnouncements(data);
      } catch (err) {
        setError("Failed to load announcements.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [refreshKey]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this announcement?");
    if (!confirmed) return;

    try {
      await deleteAnnouncement(id);

      // update UI immediately (no refresh needed)
      setAnnouncements((prev) =>
        prev.filter((announcement) => announcement.id !== id)
      );
    } catch (err) {
      setError("Failed to delete announcement.");
      console.error(err);
    }
  };

  if (loading) return <p>Loading announcements...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="dashboard-section">
      <h2>Announcements</h2>

      {announcements.length > 0 ? (
        announcements.map((announcement) => (
          <div key={announcement.id} className="item-card">
            <p><strong>{announcement.title}</strong></p>
            <p>{announcement.content}</p>

            <p style={{ fontSize: "12px", color: "#666" }}>
              By {announcement.createdBy?.firstName} {announcement.createdBy?.lastName} |{" "}
              {new Date(announcement.createdAt).toLocaleString()}
            </p>

            {/* DELETE BUTTON */}
            <button
              onClick={() => handleDelete(announcement.id)}
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
          <p><strong>No announcements yet.</strong></p>
          <p>Post an update to keep your team informed.</p>
        </div>
      )}
    </div>
  );
}

export default AnnouncementList;