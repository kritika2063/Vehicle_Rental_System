import React, { useState } from "react";

const initialVehicles = [
  {
    id: 1,
    name: "Suzuki Swift",
    type: "Car",
    fuel: "Petrol",
    seats: 5,
    rate: 3500,
    status: "Inactive",
  },
  {
    id: 2,
    name: "Tata Pickup Truck",
    type: "Truck",
    fuel: "Diesel",
    seats: 3,
    rate: 7000,
    status: "Inactive",
  },
  {
    id: 3,
    name: "Royal Enfield Himalayan",
    type: "Motorcycle",
    fuel: "Petrol",
    seats: 2,
    rate: 2500,
    status: "Active",
  },
  {
    id: 4,
    name: "Hyundai Creta",
    type: "SUV",
    fuel: "Diesel",
    seats: 5,
    rate: 6500,
    status: "Active",
  },
  {
    id: 5,
    name: "Toyota Corolla",
    type: "Car",
    fuel: "Petrol",
    seats: 5,
    rate: 4500,
    status: "Active",
  },
  {
    id: 6,
    name: "Toyota HiAce",
    type: "Van",
    fuel: "Diesel",
    seats: 12,
    rate: 8000,
    status: "Active",
  },
];

export default function AdminVehicles() {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    name: "",
    type: "Car",
    fuel: "Petrol",
    seats: "",
    rate: "",
  });

  function toggleStatus(id) {
    setVehicles(
      vehicles.map((v) =>
        v.id === id
          ? { ...v, status: v.status === "Active" ? "Inactive" : "Active" }
          : v,
      ),
    );
  }

  function saveEdit() {
    setVehicles(
      vehicles.map((v) => (v.id === editingVehicle.id ? editingVehicle : v)),
    );
    setEditingVehicle(null);
  }

  function addVehicle() {
    const id = vehicles.length + 1;
    setVehicles([
      ...vehicles,
      {
        ...newVehicle,
        id,
        seats: Number(newVehicle.seats),
        rate: Number(newVehicle.rate),
        status: "Active",
      },
    ]);
    setNewVehicle({
      name: "",
      type: "Car",
      fuel: "Petrol",
      seats: "",
      rate: "",
    });
    setShowAddModal(false);
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
    width: "460px",
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
        <h2
          style={{
            margin: 0,
            fontSize: "22px",
            fontWeight: 700,
            color: "#1e293b",
          }}
        >
          Manage Vehicles
        </h2>
        <button
          onClick={() => setShowAddModal(true)}
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
          + Add Vehicle
        </button>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: "10px",
          border: "1px solid #e2e8f0",
          overflow: "hidden",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "14px",
          }}
        >
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {[
                "Name",
                "Type",
                "Fuel",
                "Seats",
                "Rate (NPR)",
                "Status",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "12px 16px",
                    textAlign: "left",
                    fontWeight: 600,
                    fontSize: "12px",
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    borderBottom: "1px solid #e2e8f0",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v, i) => (
              <tr
                key={v.id}
                style={{
                  borderBottom:
                    i < vehicles.length - 1 ? "1px solid #f1f5f9" : "none",
                }}
              >
                <td
                  style={{
                    padding: "14px 16px",
                    fontWeight: 500,
                    color: "#1e293b",
                  }}
                >
                  {v.name}
                </td>
                <td style={{ padding: "14px 16px", color: "#64748b" }}>
                  {v.type}
                </td>
                <td style={{ padding: "14px 16px", color: "#64748b" }}>
                  {v.fuel}
                </td>
                <td style={{ padding: "14px 16px", color: "#64748b" }}>
                  {v.seats}
                </td>
                <td style={{ padding: "14px 16px", color: "#64748b" }}>
                  {v.rate.toLocaleString()}
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <span
                    style={{
                      padding: "3px 10px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: 600,
                      background: v.status === "Active" ? "#f0fdf4" : "#fef2f2",
                      color: v.status === "Active" ? "#15803d" : "#b91c1c",
                    }}
                  >
                    {v.status}
                  </span>
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <button
                    onClick={() => setEditingVehicle({ ...v })}
                    style={{
                      background: "none",
                      border: "1px solid #e2e8f0",
                      borderRadius: "6px",
                      padding: "6px 10px",
                      cursor: "pointer",
                      marginRight: "8px",
                      color: "#64748b",
                    }}
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => toggleStatus(v.id)}
                    style={{
                      background: "none",
                      border: "1px solid #e2e8f0",
                      borderRadius: "6px",
                      padding: "6px 10px",
                      cursor: "pointer",
                      color: v.status === "Active" ? "#b91c1c" : "#15803d",
                    }}
                  >
                    ⏻
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingVehicle && (
        <div style={modalStyle}>
          <div style={boxStyle}>
            <h3
              style={{ margin: "0 0 20px", fontSize: "18px", fontWeight: 700 }}
            >
              Edit Vehicle
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
                Name
              </label>
              <input
                value={editingVehicle.name}
                onChange={(e) =>
                  setEditingVehicle({ ...editingVehicle, name: e.target.value })
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
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                marginBottom: "14px",
              }}
            >
              <div>
                <label
                  style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  Type
                </label>
                <select
                  value={editingVehicle.type}
                  onChange={(e) =>
                    setEditingVehicle({
                      ...editingVehicle,
                      type: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "14px",
                  }}
                >
                  {["Car", "SUV", "Van", "Truck", "Motorcycle"].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  Fuel Type
                </label>
                <select
                  value={editingVehicle.fuel}
                  onChange={(e) =>
                    setEditingVehicle({
                      ...editingVehicle,
                      fuel: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "14px",
                  }}
                >
                  {["Petrol", "Diesel", "Electric"].map((f) => (
                    <option key={f}>{f}</option>
                  ))}
                </select>
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                marginBottom: "20px",
              }}
            >
              <div>
                <label
                  style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  Seats
                </label>
                <input
                  type="number"
                  value={editingVehicle.seats}
                  onChange={(e) =>
                    setEditingVehicle({
                      ...editingVehicle,
                      seats: e.target.value,
                    })
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
              <div>
                <label
                  style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  Daily Rate (NPR)
                </label>
                <input
                  type="number"
                  value={editingVehicle.rate}
                  onChange={(e) =>
                    setEditingVehicle({
                      ...editingVehicle,
                      rate: e.target.value,
                    })
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
                  fontSize: "14px",
                }}
              >
                Update Vehicle
              </button>
              <button
                onClick={() => setEditingVehicle(null)}
                style={{
                  flex: 1,
                  background: "#f1f5f9",
                  color: "#64748b",
                  border: "none",
                  padding: "10px",
                  borderRadius: "8px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div style={modalStyle}>
          <div style={boxStyle}>
            <h3
              style={{ margin: "0 0 20px", fontSize: "18px", fontWeight: 700 }}
            >
              Add Vehicle
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
                Name
              </label>
              <input
                value={newVehicle.name}
                onChange={(e) =>
                  setNewVehicle({ ...newVehicle, name: e.target.value })
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
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                marginBottom: "14px",
              }}
            >
              <div>
                <label
                  style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  Type
                </label>
                <select
                  value={newVehicle.type}
                  onChange={(e) =>
                    setNewVehicle({ ...newVehicle, type: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "14px",
                  }}
                >
                  {["Car", "SUV", "Van", "Truck", "Motorcycle"].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  Fuel Type
                </label>
                <select
                  value={newVehicle.fuel}
                  onChange={(e) =>
                    setNewVehicle({ ...newVehicle, fuel: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "14px",
                  }}
                >
                  {["Petrol", "Diesel", "Electric"].map((f) => (
                    <option key={f}>{f}</option>
                  ))}
                </select>
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                marginBottom: "20px",
              }}
            >
              <div>
                <label
                  style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  Seats
                </label>
                <input
                  type="number"
                  value={newVehicle.seats}
                  onChange={(e) =>
                    setNewVehicle({ ...newVehicle, seats: e.target.value })
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
              <div>
                <label
                  style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  Daily Rate (NPR)
                </label>
                <input
                  type="number"
                  value={newVehicle.rate}
                  onChange={(e) =>
                    setNewVehicle({ ...newVehicle, rate: e.target.value })
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
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={addVehicle}
                style={{
                  flex: 1,
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  padding: "10px",
                  borderRadius: "8px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Add Vehicle
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  flex: 1,
                  background: "#f1f5f9",
                  color: "#64748b",
                  border: "none",
                  padding: "10px",
                  borderRadius: "8px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "14px",
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
