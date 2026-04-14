import { useEffect, useMemo, useState } from "react";
import { getProperties, deleteProperty } from "../services/dashboardService";
import CreatePropertyForm from "./CreatePropertyForm";

function PropertyManagementPanel({ onRefresh }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingProperty, setEditingProperty] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [representationFilter, setRepresentationFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [assignedUserFilter, setAssignedUserFilter] = useState("");

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

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this property?");
    if (!confirmed) return;

    try {
      await deleteProperty(id);
      setProperties((prev) => prev.filter((property) => property.id !== id));

      if (editingProperty?.id === id) {
        setEditingProperty(null);
      }

      if (onRefresh) onRefresh();
    } catch (err) {
      setError("Failed to delete property.");
      console.error("Delete property error:", err);
      console.error("Response data:", err.response?.data);
      console.error("Status:", err.response?.status);
    }
  };

  const handleFormSuccess = async () => {
    await fetchProperties();
    setEditingProperty(null);
    if (onRefresh) onRefresh();
  };

  const uniqueAssignedUsers = useMemo(() => {
    const usersMap = new Map();

    properties.forEach((property) => {
      if (property.user?.id) {
        usersMap.set(property.user.id, {
          id: property.user.id,
          name: `${property.user.firstName} ${property.user.lastName}`,
        });
      }
    });

    return Array.from(usersMap.values());
  }, [properties]);

  const filteredProperties = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return properties.filter((property) => {
      const matchesSearch =
        !term ||
        property.address?.toLowerCase().includes(term) ||
        property.clientName?.toLowerCase().includes(term) ||
        property.mls?.toLowerCase().includes(term);

      const matchesRepresentation =
        !representationFilter || property.representation === representationFilter;

      const matchesStatus =
        !statusFilter || property.status === statusFilter;

      const matchesAssignedUser =
        !assignedUserFilter || String(property.user?.id) === assignedUserFilter;

      return (
        matchesSearch &&
        matchesRepresentation &&
        matchesStatus &&
        matchesAssignedUser
      );
    });
  }, [properties, searchTerm, representationFilter, statusFilter, assignedUserFilter]);

  return (
    <div className="dashboard-section" style={{ marginTop: "30px" }}>
      <h2>Property Management</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: "24px",
          alignItems: "start",
        }}
      >
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "16px",
            backgroundColor: "#fff",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Properties</h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <input
              type="text"
              placeholder="Search by address, client, or MLS"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ gridColumn: "1 / -1", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
            />

            <select
              value={representationFilter}
              onChange={(e) => setRepresentationFilter(e.target.value)}
              style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
            >
              <option value="">All Sides</option>
              <option value="SELLER">Seller</option>
              <option value="BUYER">Buyer</option>
              <option value="DUAL">Dual</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING">Pending</option>
              <option value="SOLD">Sold</option>
              <option value="OFF_MARKET">Off Market</option>
            </select>

            <select
              value={assignedUserFilter}
              onChange={(e) => setAssignedUserFilter(e.target.value)}
              style={{
                gridColumn: "1 / -1",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            >
              <option value="">All Assigned Users</option>
              {uniqueAssignedUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          {loading && <p>Loading properties...</p>}
          {error && <p>{error}</p>}

          {!loading && !error && filteredProperties.length === 0 && (
            <div className="empty-state">
              <p><strong>No matching properties found.</strong></p>
              <p>Try adjusting your search or filters.</p>
            </div>
          )}

          {!loading && !error && filteredProperties.length > 0 && (
            <div style={{ display: "grid", gap: "12px" }}>
              {filteredProperties.map((property) => {
                const isEditing = editingProperty?.id === property.id;

                return (
                  <div
                    key={property.id}
                    style={{
                      border: isEditing ? "2px solid #2563eb" : "1px solid #ddd",
                      backgroundColor: isEditing ? "#eff6ff" : "#fff",
                      borderRadius: "10px",
                      padding: "14px",
                      boxShadow: isEditing
                        ? "0 0 0 3px rgba(37, 99, 235, 0.15)"
                        : "0 1px 3px rgba(0,0,0,0.08)",
                    }}
                  >
                    {isEditing && (
                      <p style={{ color: "#1d4ed8", fontWeight: "bold", marginBottom: "8px" }}>
                        Currently Editing
                      </p>
                    )}

                    <p><strong>{property.address}</strong></p>
                    <p>
                      {property.city}, {property.state} {property.zipCode}
                    </p>
                    <p>Representation: {property.representation}</p>
                    <p>Status: {property.status}</p>
                    <p>MLS: {property.mls || "N/A"}</p>
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
                        onClick={() => setEditingProperty(property)}
                        style={{
                          backgroundColor: isEditing ? "#1d4ed8" : "#2563eb",
                          color: "white",
                          border: "none",
                          padding: "8px 12px",
                          borderRadius: "6px",
                          cursor: "pointer",
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
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "16px",
            backgroundColor: "#fff",
            position: "sticky",
            top: "20px",
          }}
        >
          <CreatePropertyForm
            editingProperty={editingProperty}
            onSuccess={handleFormSuccess}
          />
        </div>
      </div>
    </div>
  );
}

export default PropertyManagementPanel;