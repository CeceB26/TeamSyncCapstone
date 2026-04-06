import { useEffect, useState } from "react";
import { createProperty, getUsers } from "../services/dashboardService";

function CreatePropertyForm({ onSuccess }) {
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
        if (data.length > 0) setUserId(data[0].id);
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
      await createProperty({
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
      });

      setMessage("Property created successfully.");

      // reset form
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

      if (onSuccess) onSuccess();

    } catch (err) {
      setError("Failed to create property.");
      console.error(err);
    }
  };

  return (
    <div className="dashboard-section">
      <h2>Create Property</h2>

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
          <input value={city} onChange={(e) => setCity(e.target.value)} />
        </label>

        <label>
          State
          <input value={state} onChange={(e) => setState(e.target.value)} />
        </label>

        <label>
          Zip Code
          <input value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
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
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.firstName} {user.lastName}
              </option>
            ))}
          </select>
        </label>

        <button type="submit">Create Property</button>
      </form>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default CreatePropertyForm;