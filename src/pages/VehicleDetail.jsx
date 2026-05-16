import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../component/Footer";

export default function VehicleDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const vehicle = state?.vehicle;

  if (!vehicle) {
    return (
      <div style={{ padding: "60px", textAlign: "center" }}>
        <h2 style={{ color: "#1e293b" }}>Vehicle not found.</h2>
        <button
          onClick={() => navigate("/vehicles")}
          style={{
            marginTop: "16px",
            padding: "10px 24px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Browse Vehicles
        </button>
      </div>
    );
  }

  const { name, type, fuel_type, seats, price_per_day, image_url, available } =
    vehicle;

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <div
        style={{ maxWidth: "860px", margin: "0 auto", padding: "40px 24px" }}
      >
        {/* Back */}
        <button
          onClick={() => navigate("/vehicles")}
          style={{
            background: "none",
            border: "none",
            color: "#2563eb",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            marginBottom: "24px",
            padding: 0,
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          ← Back to Vehicles
        </button>

        {/* Main card */}
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            overflow: "hidden",
            marginBottom: "24px",
          }}
        >
          {/* Image */}
          <div style={{ position: "relative", height: "320px" }}>
            <img
              src={image_url || "https://placehold.co/860x320?text=No+Image"}
              alt={name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
            <span
              style={{
                position: "absolute",
                top: "16px",
                left: "16px",
                background: "rgba(255,255,255,0.92)",
                color: "#1e293b",
                fontSize: "12px",
                fontWeight: 600,
                padding: "4px 12px",
                borderRadius: "20px",
              }}
            >
              {type}
            </span>
            <span
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: available ? "#f0fdf4" : "#fef2f2",
                color: available ? "#15803d" : "#b91c1c",
                fontSize: "12px",
                fontWeight: 600,
                padding: "4px 12px",
                borderRadius: "20px",
                border: `1px solid ${available ? "#86efac" : "#fecaca"}`,
              }}
            >
              {available ? "✓ Available" : "✗ Unavailable"}
            </span>
          </div>

          {/* Details */}
          <div style={{ padding: "28px" }}>
            <h1
              style={{
                margin: "0 0 8px",
                fontSize: "26px",
                fontWeight: 700,
                color: "#1e293b",
              }}
            >
              {name}
            </h1>

            {/* Specs grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "16px",
                margin: "24px 0",
              }}
            >
              {[
                { label: "Type", value: type },
                { label: "Fuel", value: fuel_type },
                { label: "Seats", value: `${seats} seats` },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    background: "#f8fafc",
                    borderRadius: "10px",
                    padding: "16px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 4px",
                      fontSize: "12px",
                      color: "#64748b",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {item.label}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#1e293b",
                    }}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Price + Book */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: "20px",
                borderTop: "1px solid #f1f5f9",
              }}
            >
              <div>
                <p
                  style={{
                    margin: "0 0 2px",
                    fontSize: "13px",
                    color: "#64748b",
                  }}
                >
                  Price per day
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "28px",
                    fontWeight: 700,
                    color: "#2563eb",
                  }}
                >
                  NPR {Number(price_per_day).toLocaleString()}
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: 400,
                      color: "#94a3b8",
                    }}
                  >
                    {" "}
                    /day
                  </span>
                </p>
              </div>
              <button
                disabled={!available}
                onClick={() => navigate("/booking", { state: { vehicle } })}
                style={{
                  padding: "14px 32px",
                  background: available ? "#2563eb" : "#cbd5e1",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  fontWeight: 700,
                  fontSize: "16px",
                  cursor: available ? "pointer" : "not-allowed",
                }}
              >
                Book Now →
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
