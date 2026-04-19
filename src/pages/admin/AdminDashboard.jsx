import { useEffect, useState } from 'react';
import { adminFetch } from '../../context/AuthContext';
import './AdminDashboard.css';

const STATUS_COLORS = {
  pending:   { bg: '#fffbeb', color: '#b45309' },
  confirmed: { bg: '#f0fdf4', color: '#15803d' },
  completed: { bg: '#f1f5f9', color: '#475569' },
  cancelled: { bg: '#fef2f2', color: '#b91c1c' },
  active:    { bg: '#eff6ff', color: '#1d4ed8' },
};

export default function AdminDashboard() {
  const [counts, setCounts]   = useState({ users: 0, vehicles: 0, bookings: 0 });
  const [revenue, setRevenue] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch('/api/admin/dashboard.php')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setCounts(data.data.counts);
          setRevenue(data.data.revenue);
          setBookings(data.data.recent_bookings);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'Total Vehicles', value: counts.vehicles, icon: '🚗', color: 'blue'   },
    { label: 'Total Bookings', value: counts.bookings, icon: '📅', color: 'green'  },
    { label: 'Total Users',    value: counts.users,    icon: '👤', color: 'purple' },
    { label: 'Revenue (NPR)',  value: `NPR ${Number(revenue).toLocaleString()}`, icon: '💳', color: 'amber' },
  ];

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back — here is an overview of your rental operations.</p>
      </div>

      <div className="summary-cards">
        {statCards.map((card) => (
          <div className="summary-card" key={card.label}>
            <div className="card-info">
              <h3>{card.label}</h3>
              <p>{loading ? '—' : card.value}</p>
            </div>
            <div className={`card-icon ${card.color}`}>{card.icon}</div>
          </div>
        ))}
      </div>

      <div className="recent-bookings">
        <div className="section-header">
          <h2>Recent Bookings</h2>
          <p>Latest vehicle rental bookings</p>
        </div>

        <table className="bookings-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Vehicle</th>
              <th>Start</th>
              <th>End</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>Loading...</td></tr>
            ) : bookings.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>No bookings yet</td></tr>
            ) : (
              bookings.map((b) => {
                const s = STATUS_COLORS[b.status] || STATUS_COLORS.pending;
                return (
                  <tr key={b.id}>
                    <td>#{b.id}</td>
                    <td>{b.user_name}</td>
                    <td>{b.vehicle_name}</td>
                    <td>{b.start_date}</td>
                    <td>{b.end_date}</td>
                    <td>
                      <span className="status-badge" style={{ background: s.bg, color: s.color }}>
                        {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
