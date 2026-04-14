import { useEffect, useState } from "react";
import {
  createCommission,
  updateCommission,
  getUsers
} from "../services/dashboardService";

function CreateCommissionForm({ onSuccess, editingCommission, onCancelEdit }) {
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
        setError("");

        if (!editingCommission && data.length > 0) {
          setUserId(String(data[0].id));
        }
      } catch (err) {
        setError("Failed to load users.");
        console.error("Load users error:", err);
      }
    };

    fetchUsers();
  }, [editingCommission]);

  useEffect(() => {
    if (editingCommission) {
      setAmount(
        editingCommission.amount !== null && editingCommission.amount !== undefined
          ? String(editingCommission.amount)
          : ""
      );
      setTransactionName(editingCommission.transactionName || "");
      setClosingDate(editingCommission.closingDate || "");
      setUserId(editingCommission.user?.id ? String(editingCommission.user.id) : "");
      setMessage("");
      setError("");
    }
  }, [editingCommission]);

  const resetForm = () => {
    setAmount("");
    setTransactionName("");
    setClosingDate("");
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

    if (amount === "" || Number(amount) < 0) {
      setError("Amount must be 0 or greater.");
      return;
    }

    if (!transactionName.trim()) {
      setError("Transaction name is required.");
      return;
    }

    if (!userId) {
      setError("Please select a user.");
      return;
    }

    const commissionData = {
      amount: Number(amount),
      transactionName,
      closingDate,
      userId: Number(userId),
    };

    try {
      if (editingCommission) {
        await updateCommission(editingCommission.id, commissionData);
        setMessage("Commission updated successfully.");
      } else {
        await createCommission(commissionData);
        setMessage("Commission created successfully.");
      }

      resetForm();

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error("Commission submit error:", err);
      console.error("Response data:", err.response?.data);
      console.error("Status:", err.response?.status);
      console.error("Request URL:", err.config?.url);

      setError(
        err.response?.data?.message ||
        `Failed to ${editingCommission ? "update" : "create"} commission.`
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
        {editingCommission
          ? `Editing: ${editingCommission.transactionName}`
          : "Create Commission"}
      </h2>

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
          {editingCommission ? "Update Commission" : "Create Commission"}
        </button>

        {editingCommission && (
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

export default CreateCommissionForm;