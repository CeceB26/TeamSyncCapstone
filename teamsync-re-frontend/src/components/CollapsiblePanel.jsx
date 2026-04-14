import { useState } from "react";

function CollapsiblePanel({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "12px",
        backgroundColor: "#fff",
        marginTop: "24px",
        overflow: "hidden"
      }}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          width: "100%",
          textAlign: "left",
          padding: "16px 20px",
          border: "none",
          backgroundColor: "#f8fafc",
          fontSize: "18px",
          fontWeight: "600",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <span>{title}</span>
        <span>{isOpen ? "−" : "+"}</span>
      </button>

      {isOpen && (
        <div style={{ padding: "20px" }}>
          {children}
        </div>
      )}
    </div>
  );
}

export default CollapsiblePanel;