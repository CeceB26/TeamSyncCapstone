import { useEffect, useState } from "react";
import { createGoal, getUsers } from "../services/dashboardService";

function CreateGoalForm({ onSuccess }) {
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
        if (data.length > 0) {
          setUserId(data[0].id);
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
      await createGoal({
        title,
        description,
        targetValue: Number(targetValue),
        currentValue: Number(currentValue),
        dueDate,
        status,
        userId: Number(userId),
      });

      setMessage("Goal created successfully.");
      setTitle("");
      setDescription("");
      setTargetValue("");
      setCurrentValue("");
      setDueDate("");
      setStatus("NOT_STARTED");

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError("Failed to create goal.");
      console.error(err);
    }
  };

  return (
    <div className="dashboard-section">
      <h2>Create Goal</h2>

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
          <select value={userId} onChange={(e) => setUserId(e.target.value)} required>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.firstName} {user.lastName}
              </option>
            ))}
          </select>
        </label>

        <button type="submit">Create Goal</button>
      </form>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default CreateGoalForm;