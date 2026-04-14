import { useEffect, useState } from "react";
import {
  createAnnouncement,
  updateAnnouncement,
  getUsers
} from "../services/dashboardService";

function CreateAnnouncementForm({ onSuccess, editingAnnouncement, onCancelEdit }) {
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
        setError("");

        if (!editingAnnouncement && data.length > 0) {
          setCreatedByUserId(String(data[0].id));
        }
      } catch (err) {
        setError("Failed to load users.");
        console.error("Load users error:", err);
      }
    };

    fetchUsers();
  }, [editingAnnouncement]);

  useEffect(() => {
    if (editingAnnouncement) {
      setTitle(editingAnnouncement.title || "");
      setContent(editingAnnouncement.content || "");
      setCreatedByUserId(
        editingAnnouncement.createdBy?.id
          ? String(editingAnnouncement.createdBy.id)
          : ""
      );
      setMessage("");
      setError("");
    }
  }, [editingAnnouncement]);

  const resetForm = () => {
    setTitle("");
    setContent("");
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
      setError("Title is required.");
      return;
    }

    if (!content.trim()) {
      setError("Content is required.");
      return;
    }

    if (!createdByUserId) {
      setError("Please select a user.");
      return;
    }

    const announcementData = {
      title,
      content,
      createdByUserId: Number(createdByUserId),
    };

    try {
      if (editingAnnouncement) {
        await updateAnnouncement(editingAnnouncement.id, announcementData);
        setMessage("Announcement updated successfully.");
      } else {
        await createAnnouncement(announcementData);
        setMessage("Announcement created successfully.");
      }

      resetForm();

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error("Announcement submit error:", err);
      console.error("Response data:", err.response?.data);
      console.error("Status:", err.response?.status);
      console.error("Request URL:", err.config?.url);

      setError(
        err.response?.data?.message ||
        `Failed to ${editingAnnouncement ? "update" : "create"} announcement.`
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
        {editingAnnouncement
          ? `Editing: ${editingAnnouncement.title}`
          : "Create Announcement"}
      </h2>

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
          {editingAnnouncement ? "Update Announcement" : "Create Announcement"}
        </button>

        {editingAnnouncement && (
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

export default CreateAnnouncementForm;