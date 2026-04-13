import React, { useState } from "react";

const initialBookings = [
  {
    id: "#BK-001",
    customer: "Aarav Sharma",
    vehicle: "Hyundai Creta",
    start: "Apr 10, 2026",
    end: "Apr 13, 2026",
    status: "Active",
  },
  {
    id: "#BK-002",
    customer: "Priya Thapa",
    vehicle: "Toyota Hilux",
    start: "Apr 12, 2026",
    end: "Apr 15, 2026",
    status: "Confirmed",
  },
  {
    id: "#BK-003",
    customer: "Bikash Rai",
    vehicle: "Suzuki Swift",
    start: "Apr 08, 2026",
    end: "Apr 10, 2026",
    status: "Completed",
  },
  {
    id: "#BK-004",
    customer: "Sita Gurung",
    vehicle: "Mahindra Scorpio",
    start: "Apr 13, 2026",
    end: "Apr 16, 2026",
    status: "Pending",
  },
  {
    id: "#BK-005",
    customer: "Rajan KC",
    vehicle: "Tata Ace",
    start: "Apr 05, 2026",
    end: "Apr 07, 2026",
    status: "Cancelled",
  },
];

const statusColors = {
  Active: { bg: "#eff6ff", color: "#1d4ed8" },
  Confirmed: { bg: "#f0fdf4", color: "#15803d" },
  Completed: { bg: "#f1f5f9", color: "#475569" },
  Pending: { bg: "#fffbeb", color: "#b45309" },
  Cancelled: { bg: "#fef2f2", color: "#b91c1c" },
};

export default function AdminBookings() {
  const [filter, setFilter] = useState("All");
  const statuses = [
    "All",
    "Active",
    "Confirmed",
    "Completed",
    "Pending",
    "Cancelled",
  ];

  const filtered =
    filter === "All"
      ? initialBookings
      : initialBookings.filter((b) => b.status === filter);

  return (
    <div style={{ padding: "28px", background: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ marginBottom: "24px" }}>
        <h2
          style={{
            margin: "0 0 4px",
            fontSize: "22px",
            fontWeight: 700,
            color: "#1e293b",
          }}
        >
          Manage Bookings
        </h2>
        <p style={{ margin: 0, fontSize: "14px", color: "#64748b" }}>
          View and manage all vehicle bookings
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              padding: "7px 16px",
              borderRadius: "20px",
              border: "1px solid",
              borderColor: filter === s ? "#2563eb" : "#e2e8f0",
              background: filter === s ? "#2563eb" : "#fff",
              color: filter === s ? "#fff" : "#64748b",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            {s}
          </button>
        ))}
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
                "Booking ID",
                "Customer",
                "Vehicle",
                "Start Date",
                "End Date",
                "Status",
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
            {filtered.map((b, i) => (
              <tr
                key={b.id}
                style={{
                  borderBottom:
                    i < filtered.length - 1 ? "1px solid #f1f5f9" : "none",
                }}
              >
                <td
                  style={{
                    padding: "14px 16px",
                    fontWeight: 500,
                    color: "#1e293b",
                  }}
                >
                  {b.id}
                </td>
                <td style={{ padding: "14px 16px", color: "#1e293b" }}>
                  {b.customer}
                </td>
                <td style={{ padding: "14px 16px", color: "#64748b" }}>
                  {b.vehicle}
                </td>
                <td style={{ padding: "14px 16px", color: "#64748b" }}>
                  {b.start}
                </td>
                <td style={{ padding: "14px 16px", color: "#64748b" }}>
                  {b.end}
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <span
                    style={{
                      padding: "3px 10px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: 600,
                      background: statusColors[b.status]?.bg,
                      color: statusColors[b.status]?.color,
                    }}
                  >
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
