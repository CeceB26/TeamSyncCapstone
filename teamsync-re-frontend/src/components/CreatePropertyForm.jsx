import { useEffect, useState } from "react";
import { createProperty, updateProperty, getUsers } from "../services/dashboardService";

function CreatePropertyForm({ onSuccess, editingProperty, onCancelEdit }) {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [representation, setRepresentation] = useState("");
  const [listingDate, setListingDate] = useState("");
  const [closingDate, setClosingDate] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [mls, setMls] = useState("");
  const [listPrice, setListPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [clientName, setClientName] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
        setError("");

        if (!editingProperty) {
          if (data.length > 0) {
            setUserId(String(data[0].id));
          } else {
            setUserId("");
            setError("No users found. Please create a user before creating a property.");
          }
        }
      } catch (err) {
        setError("Failed to load users.");
        console.error("Load users error:", err);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (editingProperty) {
      setRepresentation(editingProperty.representation || "");
      setListingDate(editingProperty.listingDate || "");
      setClosingDate(editingProperty.closingDate || "");
      setAddress(editingProperty.address || "");
      setCity(editingProperty.city || "");
      setState(editingProperty.state || "");
      setZipCode(editingProperty.zipCode || "");
      setMls(editingProperty.mls || "");
      setListPrice(
        editingProperty.listPrice !== null && editingProperty.listPrice !== undefined
          ? String(editingProperty.listPrice)
          : ""
      );
      setSalePrice(
        editingProperty.salePrice !== null && editingProperty.salePrice !== undefined
          ? String(editingProperty.salePrice)
          : ""
      );
      setStatus(editingProperty.status || "ACTIVE");
      setClientName(editingProperty.clientName || "");
      setUserId(editingProperty.user?.id ? String(editingProperty.user.id) : "");
      setMessage("");
      setError("");
    } else {
      resetForm();
    }
  }, [editingProperty]);

  const resetForm = () => {
    setRepresentation("");
    setListingDate("");
    setClosingDate("");
    setAddress("");
    setCity("");
    setState("");
    setZipCode("");
    setMls("");
    setListPrice("");
    setSalePrice("");
    setStatus("ACTIVE");
    setClientName("");
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

    if (users.length === 0 || !userId) {
      setError("Please create or select a user before creating or updating a property.");
      return;
    }

    if (!listPrice || isNaN(Number(listPrice))) {
      setError("List price is required and must be a valid number.");
      return;
    }

    if (Number(listPrice) <= 0) {
      setError("List price must be greater than 0.");
      return;
    }

    if (salePrice && isNaN(Number(salePrice))) {
      setError("Sale price must be a valid number.");
      return;
    }

    if (salePrice && Number(salePrice) <= 0) {
      setError("Sale price must be greater than 0.");
      return;
    }

    const propertyData = {
      representation,
      listingDate,
      closingDate,
      address,
      city,
      state,
      zipCode,
      mls,
      listPrice: Number(listPrice),
      salePrice: salePrice ? Number(salePrice) : null,
      status,
      clientName,
      userId: Number(userId),
    };

    try {
      if (editingProperty) {
        await updateProperty(editingProperty.id, propertyData);
        setMessage("Property updated successfully.");
      } else {
        await createProperty(propertyData);
        setMessage("Property created successfully.");
      }

      resetForm();

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error("Property submit error:", err);
      console.error("Response data:", err.response?.data);
      console.error("Status:", err.response?.status);
      console.error("Request URL:", err.config?.url);

      setError(
        err.response?.data?.message ||
          `Failed to ${editingProperty ? "update" : "create"} property. Status: ${
            err.response?.status || "unknown"
          }`
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
        {editingProperty
          ? `Editing: ${editingProperty.address}`
          : "Create Property"}
      </h2>

      <form onSubmit={handleSubmit} className="form-layout">
        <label>
          Representation
          <select
            value={representation}
            onChange={(e) => setRepresentation(e.target.value)}
            required
          >
            <option value="">Select Representation</option>
            <option value="SELLER">Seller</option>
            <option value="BUYER">Buyer</option>
            <option value="DUAL">Dual</option>
          </select>
        </label>

        <label>
          Listing Date
          <input
            type="date"
            value={listingDate}
            onChange={(e) => setListingDate(e.target.value)}
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
          Address
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </label>

        <label>
          MLS
          <input
            type="text"
            value={mls}
            onChange={(e) => setMls(e.target.value)}
          />
        </label>

        <label>
          City
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </label>

        <label>
          State
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
        </label>

        <label>
          Zip Code
          <input
            type="text"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
          />
        </label>

        <label>
          List Price
          <input
            type="number"
            value={listPrice}
            onChange={(e) => setListPrice(e.target.value)}
            required
          />
        </label>

        <label>
          Sale Price
          <input
            type="number"
            value={salePrice}
            onChange={(e) => setSalePrice(e.target.value)}
          />
        </label>

        <label>
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="ACTIVE">Active</option>
            <option value="PENDING">Pending</option>
            <option value="SOLD">Sold</option>
            <option value="OFF_MARKET">Off Market</option>
          </select>
        </label>

        <label>
          Client Name
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
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
          {editingProperty ? "Update Property" : "Create Property"}
        </button>

        {editingProperty && (
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

export default CreatePropertyForm;