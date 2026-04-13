import React, { useState } from "react";

const initialTerms = [
  {
    id: 1,
    title: "Eligibility",
    content:
      "Users must be aged 18 years and possess a valid driving licence for the vehicle type they are renting.",
  },
  {
    id: 2,
    title: "Identity Verification",
    content:
      "The rental company has the right to demand a government-issued photo ID and valid driving licence at the time of vehicle handover.",
  },
  {
    id: 3,
    title: "Booking Confirmation",
    content:
      "Booking is only confirmed after payment verification via eSewa or Khalti. A confirmation email with a booking reference will be sent.",
  },
  {
    id: 4,
    title: "Cancellation Policy",
    content:
      "Cancellations 48h+ before pickup: NPR 200 processing fee. 24-48h before: 50% refund. Less than 24h or no-show: non-refundable.",
  },
  {
    id: 5,
    title: "Fuel Policy",
    content:
      "Vehicles must be returned with the same fuel level as at pickup. Refueling charges plus NPR 300 service fee apply otherwise.",
  },
  {
    id: 6,
    title: "Damage Policy",
    content:
      "The renter is responsible for any damage beyond normal wear and tear. Minor scratches: NPR 5,000-20,000. Major damage: NPR 20,000-100,000.",
  },
  {
    id: 7,
    title: "Late Return",
    content:
      "Vehicles not returned by the agreed time will incur a daily rate fee. Failure to return within 24 hours without notice may result in prosecution.",
  },
  {
    id: 8,
    title: "Prohibited Use",
    content:
      "Vehicle must not be used for racing, off-road driving, transportation of illegal goods, sub-leasing, or driving under the influence.",
  },
];

export default function AdminTerms() {
  const [terms, setTerms] = useState(initialTerms);
  const [editing, setEditing] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newTerm, setNewTerm] = useState({ title: "", content: "" });

  function saveEdit() {
    setTerms(terms.map((t) => (t.id === editing.id ? editing : t)));
    setEditing(null);
  }

  function addTerm() {
    setTerms([...terms, { ...newTerm, id: terms.length + 1 }]);
    setNewTerm({ title: "", content: "" });
    setShowAdd(false);
  }

  function deleteTerm(id) {
    setTerms(terms.filter((t) => t.id !== id));
  }

  const modalStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  };

  const boxStyle = {
    background: "#fff",
    borderRadius: "12px",
    padding: "28px",
    width: "500px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
  };

  return (
    <div style={{ padding: "28px", background: "#f8fafc", minHeight: "100vh" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div>
          <h2
            style={{
              margin: "0 0 4px",
              fontSize: "22px",
              fontWeight: 700,
              color: "#1e293b",
            }}
          >
            Terms & Conditions
          </h2>
          <p style={{ margin: 0, fontSize: "14px", color: "#64748b" }}>
            Manage rental terms and conditions
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          style={{
            background: "#2563eb",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          + Add Clause
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {terms.map((term, i) => (
          <div
            key={term.id}
            style={{
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              padding: "18px 20px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "8px",
                  }}
                >
                  <span
                    style={{
                      background: "#eff6ff",
                      color: "#1d4ed8",
                      borderRadius: "20px",
                      padding: "2px 10px",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  >
                    Clause {i + 1}
                  </span>
                  <span
                    style={{
                      fontWeight: 600,
                      fontSize: "15px",
                      color: "#1e293b",
                    }}
                  >
                    {term.title}
                  </span>
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: "14px",
                    color: "#64748b",
                    lineHeight: "1.6",
                  }}
                >
                  {term.content}
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  marginLeft: "16px",
                  flexShrink: 0,
                }}
              >
                <button
                  onClick={() => setEditing({ ...term })}
                  style={{
                    background: "none",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    padding: "6px 10px",
                    cursor: "pointer",
                    color: "#64748b",
                    fontSize: "13px",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTerm(term.id)}
                  style={{
                    background: "none",
                    border: "1px solid #fecaca",
                    borderRadius: "6px",
                    padding: "6px 10px",
                    cursor: "pointer",
                    color: "#b91c1c",
                    fontSize: "13px",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div style={modalStyle}>
          <div style={boxStyle}>
            <h3
              style={{ margin: "0 0 20px", fontSize: "18px", fontWeight: 700 }}
            >
              Edit Clause
            </h3>
            <div style={{ marginBottom: "14px" }}>
              <label
                style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                Title
              </label>
              <input
                value={editing.title}
                onChange={(e) =>
                  setEditing({ ...editing, title: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                Content
              </label>
              <textarea
                value={editing.content}
                onChange={(e) =>
                  setEditing({ ...editing, content: e.target.value })
                }
                rows={4}
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                  resize: "vertical",
                }}
              />
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={saveEdit}
                style={{
                  flex: 1,
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  padding: "10px",
                  borderRadius: "8px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditing(null)}
                style={{
                  flex: 1,
                  background: "#f1f5f9",
                  color: "#64748b",
                  border: "none",
                  padding: "10px",
                  borderRadius: "8px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showAdd && (
        <div style={modalStyle}>
          <div style={boxStyle}>
            <h3
              style={{ margin: "0 0 20px", fontSize: "18px", fontWeight: 700 }}
            >
              Add New Clause
            </h3>
            <div style={{ marginBottom: "14px" }}>
              <label
                style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                Title
              </label>
              <input
                value={newTerm.title}
                onChange={(e) =>
                  setNewTerm({ ...newTerm, title: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                Content
              </label>
              <textarea
                value={newTerm.content}
                onChange={(e) =>
                  setNewTerm({ ...newTerm, content: e.target.value })
                }
                rows={4}
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                  resize: "vertical",
                }}
              />
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={addTerm}
                style={{
                  flex: 1,
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  padding: "10px",
                  borderRadius: "8px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Add Clause
              </button>
              <button
                onClick={() => setShowAdd(false)}
                style={{
                  flex: 1,
                  background: "#f1f5f9",
                  color: "#64748b",
                  border: "none",
                  padding: "10px",
                  borderRadius: "8px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
