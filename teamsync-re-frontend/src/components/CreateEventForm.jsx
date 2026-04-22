import { useEffect, useState } from "react";
import { createEvent, updateEvent, getUsers } from "../services/dashboardService";

function CreateEventForm({ onSuccess, editingEvent, onCancelEdit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [location, setLocation] = useState("");
  const [createdByUserId, setCreatedByUserId] = useState("");
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
        setError("");

        if (!editingEvent && data.length > 0) {
          setCreatedByUserId(String(data[0].id));
        }
      } catch (err) {
        setError("Failed to load users.");
        console.error("Load users error:", err);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title || "");
      setDescription(editingEvent.description || "");
      setLocation(editingEvent.location || "");
      setCreatedByUserId(
        editingEvent.createdBy?.id ? String(editingEvent.createdBy.id) : ""
      );

      if (editingEvent.eventDate) {
        const eventDateObj = new Date(editingEvent.eventDate);

        const year = eventDateObj.getFullYear();
        const month = String(eventDateObj.getMonth() + 1).padStart(2, "0");
        const day = String(eventDateObj.getDate()).padStart(2, "0");
        const hours = String(eventDateObj.getHours()).padStart(2, "0");
        const minutes = String(eventDateObj.getMinutes()).padStart(2, "0");

        setEventDate(`${year}-${month}-${day}`);
        setEventTime(`${hours}:${minutes}`);
      } else {
        setEventDate("");
        setEventTime("");
      }

      setMessage("");
      setError("");
    } else {
      resetForm();
    }
  }, [editingEvent]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setEventDate("");
    setEventTime("");
    setLocation("");
    setMessage("");
    setError("");

    if (users.length > 0) {
      setCreatedByUserId(String(users[0].id));
    } else {
      setCreatedByUserId("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!title.trim()) {
      setError("Event title is required.");
      return;
    }

    if (!eventDate) {
      setError("Event date is required.");
      return;
    }

    if (!eventTime) {
      setError("Event time is required.");
      return;
    }

    if (!createdByUserId) {
      setError("Please select a user.");
      return;
    }

    const formattedDateTime = `${eventDate}T${eventTime}:00`;

    const eventData = {
      title,
      description,
      eventDate: formattedDateTime,
      location,
      createdByUserId: Number(createdByUserId),
    };

    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, eventData);
        setMessage("Event updated successfully.");
      } else {
        await createEvent(eventData);
        setMessage("Event created successfully.");
      }

      resetForm();

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error("Event submit error:", err);
      console.error("Response data:", err.response?.data);
      console.error("Status:", err.response?.status);
      console.error("Request URL:", err.config?.url);

      setError(
        err.response?.data?.message ||
        `Failed to ${editingEvent ? "update" : "create"} event.`
      );
    }
  };

  const handleCancelEdit = () => {
    resetForm();
    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  return (
    <div className="dashboard-section">
      <h2>
        {editingEvent ? `Editing: ${editingEvent.title}` : "Create Event"}
      </h2>

      <form onSubmit={handleSubmit} className="form-layout">
        <label>
          Event Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <label>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <label>
          Event Date
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            required
          />
        </label>

        <label>
          Event Time
          <input
            type="time"
            value={eventTime}
            onChange={(e) => setEventTime(e.target.value)}
            required
          />
        </label>

        <label>
          Location
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </label>

        <label>
          Created By
          <select
            value={createdByUserId}
            onChange={(e) => setCreatedByUserId(e.target.value)}
            required
            disabled={users.length === 0}
          >
            <option value="">
              {users.length === 0 ? "No users available" : "Select a user"}
            </option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.firstName} {user.lastName}
              </option>
            ))}
          </select>
        </label>

        <button type="submit" disabled={users.length === 0}>
          {editingEvent ? "Update Event" : "Create Event"}
        </button>

        {editingEvent && (
          <button
            type="button"
            onClick={handleCancelEdit}
            style={{
              marginTop: "10px",
              backgroundColor: "#6b7280",
              color: "white",
              border: "none",
              padding: "8px 12px",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Cancel Edit
          </button>
        )}
      </form>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default CreateEventForm;