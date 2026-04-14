import { useEffect, useMemo, useState } from "react";
import {
  getAnnouncements,
  deleteAnnouncement
} from "../services/dashboardService";
import CreateAnnouncementForm from "./CreateAnnouncementForm";

function AnnouncementManagementPanel({ onRefresh }) {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await getAnnouncements();
      setAnnouncements(data);
      setError("");
    } catch (err) {
      setError("Failed to load announcements.");
      console.error("Load announcements error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this announcement?");
    if (!confirmed) return;

    try {
      await deleteAnnouncement(id);
      setAnnouncements((prev) =>
        prev.filter((announcement) => announcement.id !== id)
      );

      if (editingAnnouncement?.id === id) {
        setEditingAnnouncement(null);
      }

      if (onRefresh) onRefresh();
    } catch (err) {
      setError("Failed to delete announcement.");
      console.error("Delete announcement error:", err);
      console.error("Response data:", err.response?.data);
      console.error("Status:", err.response?.status);
      console.error("Request URL:", err.config?.url);
    }
  };

  const handleFormSuccess = async () => {
    await fetchAnnouncements();
    setEditingAnnouncement(null);
    if (onRefresh) onRefresh();
  };

  const filteredAnnouncements = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return announcements.filter((announcement) => {
      if (!term) return true;

      return (
        announcement.title?.toLowerCase().includes(term) ||
        announcement.content?.toLowerCase().includes(term)
      );
    });
  }, [announcements, searchTerm]);

  return (
    <div className="dashboard-section" style={{ marginTop: "30px" }}>
      <h2>Announcement Management</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: "24px",
          alignItems: "start"
        }}
      >
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "16px",
            backgroundColor: "#fff"
          }}
        >
          <h3 style={{ marginTop: 0 }}>Announcements</h3>

          <input
            type="text"
            placeholder="Search by title or content"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              marginBottom: "16px"
            }}
          />

          {loading && <p>Loading announcements...</p>}
          {error && <p>{error}</p>}

          {!loading && !error && filteredAnnouncements.length === 0 && (
            <div className="empty-state">
              <p><strong>No matching announcements found.</strong></p>
              <p>Try changing your search.</p>
            </div>
          )}

          {!loading && !error && filteredAnnouncements.length > 0 && (
            <div style={{ display: "grid", gap: "12px" }}>
              {filteredAnnouncements.map((announcement) => {
                const isEditing = editingAnnouncement?.id === announcement.id;

                return (
                  <div
                    key={announcement.id}
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

                    <p><strong>{announcement.title}</strong></p>
                    <p>{announcement.content}</p>

                    <p style={{ fontSize: "12px", color: "#666" }}>
                      By {announcement.createdBy?.firstName} {announcement.createdBy?.lastName} |{" "}
                      {new Date(announcement.createdAt).toLocaleString()}
                    </p>

                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                      <button
                        onClick={() => setEditingAnnouncement(announcement)}
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
                        onClick={() => handleDelete(announcement.id)}
                        style={{
                          backgroundColor: "#c62828",
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
          <CreateAnnouncementForm
            editingAnnouncement={editingAnnouncement}
            onSuccess={handleFormSuccess}
            onCancelEdit={() => setEditingAnnouncement(null)}
          />
        </div>
      </div>
    </div>
  );
}

export default AnnouncementManagementPanel;