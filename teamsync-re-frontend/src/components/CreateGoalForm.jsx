import { useEffect, useState } from "react";
import { createGoal, updateGoal, getUsers } from "../services/dashboardService";

function CreateGoalForm({ onSuccess, editingGoal, onCancelEdit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [currentValue, setCurrentValue] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("NOT_STARTED");
  const [userId, setUserId] = useState("");
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
        setError("");

        if (!editingGoal && data.length > 0) {
          setUserId(String(data[0].id));
        }
      } catch (err) {
        setError("Failed to load users.");
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (editingGoal) {
      setTitle(editingGoal.title || "");
      setDescription(editingGoal.description || "");
      setTargetValue(
        editingGoal.targetValue !== null && editingGoal.targetValue !== undefined
          ? String(editingGoal.targetValue)
          : ""
      );
      setCurrentValue(
        editingGoal.currentValue !== null && editingGoal.currentValue !== undefined
          ? String(editingGoal.currentValue)
          : ""
      );
      setDueDate(editingGoal.dueDate || "");
      setStatus(editingGoal.status || "NOT_STARTED");
      setUserId(editingGoal.user?.id ? String(editingGoal.user.id) : "");
      setMessage("");
      setError("");
    } else {
      resetForm();
    }
  }, [editingGoal]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setTargetValue("");
    setCurrentValue("");
    setDueDate("");
    setStatus("NOT_STARTED");
    setMessage("");
    setError("");

    if (users.length > 0) {
      setUserId(String(users[0].id));
    } else {
      setUserId("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!title.trim()) {
      setError("Goal title is required.");
      return;
    }

    if (targetValue === "" || isNaN(Number(targetValue))) {
      setError("Target value is required and must be a valid number.");
      return;
    }

    if (Number(targetValue) < 0) {
      setError("Target value cannot be negative.");
      return;
    }

    if (currentValue === "" || isNaN(Number(currentValue))) {
      setError("Current value is required and must be a valid number.");
      return;
    }

    if (Number(currentValue) < 0) {
      setError("Current value cannot be negative.");
      return;
    }

    if (!userId) {
      setError("Please select a user.");
      return;
    }

    const goalData = {
      title,
      description,
      targetValue: Number(targetValue),
      currentValue: Number(currentValue),
      dueDate,
      status,
      userId: Number(userId),
    };

    try {
      if (editingGoal) {
        await updateGoal(editingGoal.id, goalData);
        setMessage("Goal updated successfully.");
      } else {
        await createGoal(goalData);
        setMessage("Goal created successfully.");
      }

      resetForm();

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          `Failed to ${editingGoal ? "update" : "create"} goal.`
      );
      console.error(err);
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
        {editingGoal ? `Editing: ${editingGoal.title}` : "Create Goal"}
      </h2>

      <form onSubmit={handleSubmit} className="form-layout">
        <label>
          Goal Title
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
          Target Value
          <input
            type="number"
            value={targetValue}
            onChange={(e) => setTargetValue(e.target.value)}
            required
          />
        </label>

        <label>
          Current Value
          <input
            type="number"
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            required
          />
        </label>

        <label>
          Due Date
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </label>

        <label>
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="NOT_STARTED">Not Started</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </label>

        <label>
          Assigned User
          <select
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
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
          {editingGoal ? "Update Goal" : "Create Goal"}
        </button>

        {editingGoal && (
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

export default CreateGoalForm;
