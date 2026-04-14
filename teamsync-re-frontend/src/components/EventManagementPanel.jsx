import { useEffect, useMemo, useState } from "react";
import { getEvents, deleteEvent } from "../services/dashboardService";
import CreateEventForm from "./CreateEventForm";

function EventManagementPanel({ onRefresh }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingEvent, setEditingEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await getEvents();
      setEvents(data);
      setError("");
    } catch (err) {
      setError("Failed to load events.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

 const handleDelete = async (id) => {
  const confirmed = window.confirm("Delete this event?");
  if (!confirmed) return;

  try {
    await deleteEvent(id);
    setEvents((prev) => prev.filter((event) => event.id !== id));

    if (editingEvent?.id === id) {
      setEditingEvent(null);
    }

    if (onRefresh) onRefresh();
  } catch (err) {
    setError("Failed to delete event.");
    console.error("Delete event error:", err);
    console.error("Response data:", err.response?.data);
    console.error("Status:", err.response?.status);
    console.error("Request URL:", err.config?.url);
  }
};

  const handleFormSuccess = async () => {
    await fetchEvents();
    setEditingEvent(null);
    if (onRefresh) onRefresh();
  };

  const filteredEvents = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return events.filter((event) => {
      if (!term) return true;

      return (
        event.title?.toLowerCase().includes(term) ||
        event.description?.toLowerCase().includes(term) ||
        event.location?.toLowerCase().includes(term)
      );
    });
  }, [events, searchTerm]);

  return (
    <div className="dashboard-section" style={{ marginTop: "30px" }}>
      <h2>Event Management</h2>

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
          <h3 style={{ marginTop: 0 }}>Events</h3>

          <input
            type="text"
            placeholder="Search by title, description, or location"
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

          {loading && <p>Loading events...</p>}
          {error && <p>{error}</p>}

          {!loading && !error && filteredEvents.length === 0 && (
            <div className="empty-state">
              <p><strong>No matching events found.</strong></p>
              <p>Try changing your search.</p>
            </div>
          )}

          {!loading && !error && filteredEvents.length > 0 && (
            <div style={{ display: "grid", gap: "12px" }}>
              {filteredEvents.map((event) => {
                const isEditing = editingEvent?.id === event.id;

                return (
                  <div
                    key={event.id}
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

                    <p><strong>{event.title}</strong></p>
                    <p>{event.description}</p>
                    {event.location && <p>Location: {event.location}</p>}

                    {event.eventDate && (
                      <p>
                        Date: {new Date(event.eventDate).toLocaleString()}
                      </p>
                    )}

                    <p style={{ fontSize: "12px", color: "#666" }}>
                      By {event.createdBy?.firstName} {event.createdBy?.lastName}
                    </p>

                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                      <button
                        onClick={() => setEditingEvent(event)}
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
                        onClick={() => handleDelete(event.id)}
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
          <CreateEventForm
            editingEvent={editingEvent}
            onSuccess={handleFormSuccess}
            onCancelEdit={() => setEditingEvent(null)}
          />
        </div>
      </div>
    </div>
  );
}

export default EventManagementPanel;