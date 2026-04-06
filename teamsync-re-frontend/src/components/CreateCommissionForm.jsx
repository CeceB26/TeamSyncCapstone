import { useEffect, useState } from "react";
import { createCommission, getUsers } from "../services/dashboardService";

function CreateCommissionForm({ onSuccess }) {
  const [amount, setAmount] = useState("");
  const [transactionName, setTransactionName] = useState("");
  const [closingDate, setClosingDate] = useState("");
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
      await createCommission({
        amount: Number(amount),
        transactionName,
        closingDate,
        userId: Number(userId),
      });

      setMessage("Commission created successfully.");
      setAmount("");
      setTransactionName("");
      setClosingDate("");

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError("Failed to create commission.");
      console.error(err);
    }
  };

  return (
    <div className="dashboard-section">
      <h2>Create Commission</h2>

      <form onSubmit={handleSubmit} className="form-layout">
        <label>
          Amount
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </label>

        <label>
          Transaction Name
          <input
            type="text"
            value={transactionName}
            onChange={(e) => setTransactionName(e.target.value)}
            required
          />
        </label>

        <label>
          Closing Date
          <input
            type="date"
            value={closingDate}
            onChange={(e) => setClosingDate(e.target.value)}
          />
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

        <button type="submit">Create Commission</button>
      </form>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default CreateCommissionForm;