import React from "react";

function PropertyListUser({ properties, emptyText = "No properties assigned yet." }) {
  if (!properties || properties.length === 0) {
    return (
      <p style={{ color: "#666", fontStyle: "italic", margin: "10px 0" }}>
        {emptyText}
      </p>
    );
  }

  const propertyCardStyle = {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "15px",
    marginBottom: "10px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  };

  const propertyTitleStyle = {
    fontSize: "16px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "8px",
  };

  const propertyDetailStyle = {
    fontSize: "13px",
    color: "#555",
    marginBottom: "5px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
  };

  const valueTextStyle = {
    textAlign: "right",
    wordBreak: "break-word",
  };

  const statusBadgeStyle = (status) => ({
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "500",
    backgroundColor:
      status === "SOLD"
        ? "#d4edda"
        : status === "PENDING"
        ? "#fff3cd"
        : status === "ACTIVE"
        ? "#d1ecf1"
        : "#e2e3e5",
    color:
      status === "SOLD"
        ? "#155724"
        : status === "PENDING"
        ? "#856404"
        : status === "ACTIVE"
        ? "#0c5460"
        : "#383d41",
  });

  const priceStyle = {
    fontSize: "14px",
    fontWeight: "600",
    color: "#2c5282",
  };

  return (
    <div style={{ display: "grid", gap: "12px" }}>
      {properties.map((property) => (
        <div key={property.id} style={propertyCardStyle}>
          <div style={propertyTitleStyle}>
            {property.address || "Untitled Property"}
          </div>

          {property.city && property.state && property.zipCode && (
            <div style={propertyDetailStyle}>
              <span>📍 Location</span>
              <span style={valueTextStyle}>
                {property.city}, {property.state} {property.zipCode}
              </span>
            </div>
          )}

          {property.agentName && (
            <div style={propertyDetailStyle}>
              <span>🧑‍💼 Agent</span>
              <span style={valueTextStyle}>{property.agentName}</span>
            </div>
          )}

          {property.mls && (
            <div style={propertyDetailStyle}>
              <span>🏷️ MLS</span>
              <span style={valueTextStyle}>{property.mls}</span>
            </div>
          )}

          {property.representation && (
            <div style={propertyDetailStyle}>
              <span>🤝 Representation</span>
              <span style={valueTextStyle}>{property.representation}</span>
            </div>
          )}

          {property.clientName && (
            <div style={propertyDetailStyle}>
              <span>👤 Client</span>
              <span style={valueTextStyle}>{property.clientName}</span>
            </div>
          )}

          {property.listPrice && (
            <div style={propertyDetailStyle}>
              <span>💰 List Price</span>
              <span style={{ ...priceStyle, ...valueTextStyle }}>
                ${Number(property.listPrice).toLocaleString()}
              </span>
            </div>
          )}

          {property.salePrice && (
            <div style={propertyDetailStyle}>
              <span>✅ Sale Price</span>
              <span style={{ ...priceStyle, ...valueTextStyle }}>
                ${Number(property.salePrice).toLocaleString()}
              </span>
            </div>
          )}

          {property.status && (
            <div style={propertyDetailStyle}>
              <span>Status</span>
              <span style={statusBadgeStyle(property.status)}>
                {property.status}
              </span>
            </div>
          )}

          {(property.listingDate || property.closingDate) && (
            <div style={propertyDetailStyle}>
              <span>📅 Dates</span>
              <span style={valueTextStyle}>
                {property.listingDate ? `Listed: ${property.listingDate}` : ""}
                {property.listingDate && property.closingDate ? " | " : ""}
                {property.closingDate ? `Closed: ${property.closingDate}` : ""}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default PropertyListUser;