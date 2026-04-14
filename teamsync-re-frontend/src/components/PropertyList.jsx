import { useEffect, useState } from "react";
import { getProperties, deleteProperty } from "../services/dashboardService";

function PropertyList({ refreshKey, onEdit, editingProperty }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const data = await getProperties();
        setProperties(data);
        setError("");
      } catch (err) {
        setError("Failed to load properties.");
        console.error("Load properties error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [refreshKey]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this property?");
    if (!confirmed) return;

    try {
      await deleteProperty(id);
      setProperties((prev) => prev.filter((property) => property.id !== id));
      setError("");
    } catch (err) {
      setError("Failed to delete property.");
      console.error("Delete property error:", err);
      console.error("Response data:", err.response?.data);
      console.error("Status:", err.response?.status);
    }
  };

  if (loading) return <p>Loading properties...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="dashboard-section">
      <h2>Properties</h2>

      {properties.length > 0 ? (
        properties.map((property) => {
          const isEditing = editingProperty?.id === property.id;

          return (
            <div
              key={property.id}
              className="item-card"
              style={{
                border: isEditing ? "2px solid #2563eb" : "1px solid #ddd",
                backgroundColor: isEditing ? "#eff6ff" : "white",
                boxShadow: isEditing
                  ? "0 0 0 3px rgba(37, 99, 235, 0.15)"
                  : "0 1px 3px rgba(0, 0, 0, 0.08)",
                transition: "all 0.2s ease-in-out",
                borderRadius: "10px",
                padding: "16px",
                marginBottom: "16px"
              }}
            >
              {isEditing && (
                <p
                  style={{
                    color: "#1d4ed8",
                    fontWeight: "bold",
                    marginBottom: "10px"
                  }}
                >
                  Currently Editing
                </p>
              )}

              <p><strong>{property.address}</strong></p>
              <p>
                {property.city}, {property.state} {property.zipCode}
              </p>
              <p>Representation: {property.representation}</p>
              <p>Status: {property.status}</p>
              <p>List Price: ${property.listPrice?.toLocaleString()}</p>

              {property.salePrice && (
                <p>Sale Price: ${property.salePrice.toLocaleString()}</p>
              )}

              {property.clientName && <p>Client: {property.clientName}</p>}

              <p style={{ fontSize: "12px", color: "#666" }}>
                Assigned to {property.user?.firstName} {property.user?.lastName}
              </p>

              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button
                  onClick={() => onEdit(property)}
                  style={{
                    backgroundColor: isEditing ? "#1d4ed8" : "#2563eb",
                    color: "white",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    cursor: "pointer"
                  }}
                >
                  {isEditing ? "Editing" : "Edit"}
                </button>

                <button
                  onClick={() => handleDelete(property.id)}
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    cursor: "pointer"
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })
      ) : (
        <div className="empty-state">
          <p><strong>No properties yet.</strong></p>
          <p>Add a property to start tracking listings and transactions.</p>
        </div>
      )}
    </div>
  );
}

export default PropertyList;