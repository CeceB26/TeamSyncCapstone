import { useEffect, useState } from "react";
import { createAnnouncement, getUsers } from "../services/dashboardService";

function CreateAnnouncementForm({ onSuccess }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
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
      await createAnnouncement({
        title,
        content,
        createdByUserId: Number(createdByUserId),
      });

      setMessage("Announcement created successfully.");
      setTitle("");
      setContent("");

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError("Failed to create announcement.");
      console.error(err);
    }
  };

  return (
    <div className="dashboard-section">
      <h2>Create Announcement</h2>

      <form onSubmit={handleSubmit} className="form-layout">
        <label>
          Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <label>
          Content
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
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

        <button type="submit">Create Announcement</button>
      </form>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}


export default CreateAnnouncementForm;