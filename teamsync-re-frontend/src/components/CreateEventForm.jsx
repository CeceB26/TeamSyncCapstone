import { useEffect, useState } from "react";
import { createEvent, getUsers } from "../services/dashboardService";

function CreateEventForm({ onSuccess }) {
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
        if (data.length > 0) {
          setCreatedByUserId(data[0].id);
        }
      } catch (err) {
        setError("Failed to load users.");
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const formattedDateTime = `${eventDate}T${eventTime}:00`;

      await createEvent({
        title,
        description,
        eventDate: formattedDateTime,
        location,
        createdByUserId: Number(createdByUserId),
      });

      setMessage("Event created successfully.");
      setTitle("");
      setDescription("");
      setEventDate("");
      setEventTime("");
      setLocation("");

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError("Failed to create event.");
      console.error(err);
    }
  };

  return (
    <div className="dashboard-section">
      <h2>Create Event</h2>

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
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.firstName} {user.lastName}
              </option>
            ))}
          </select>
        </label>

        <button type="submit">Create Event</button>
      </form>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default CreateEventForm;