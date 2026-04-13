import React, { useState } from 'react';
import './AdminDashboard.css';

const sampleBookings = [
  { id: '#BK-001', customer: 'Aarav Sharma', vehicle: 'Hyundai Creta', date: 'Apr 10, 2026', status: 'active' },
  { id: '#BK-002', customer: 'Priya Thapa', vehicle: 'Toyota Hilux', date: 'Apr 12, 2026', status: 'confirmed' },
  { id: '#BK-003', customer: 'Bikash Rai', vehicle: 'Suzuki Swift', date: 'Apr 08, 2026', status: 'completed' },
  { id: '#BK-004', customer: 'Sita Gurung', vehicle: 'Mahindra Scorpio', date: 'Apr 13, 2026', status: 'pending' },
  { id: '#BK-005', customer: 'Rajan KC', vehicle: 'Tata Ace', date: 'Apr 05, 2026', status: 'cancelled' },
];

const stats = {
  vehicles: 24,
  bookings: 58,
  users: 134,
  payments: 47,
};

export default function AdminDashboard() {
  const [bookings] = useState(sampleBookings);

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back — here is an overview of your rental operations.</p>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-info">
            <h3>Total Vehicles</h3>
            <p>{stats.vehicles}</p>
          </div>
          <div className="card-icon blue">🚗</div>
        </div>

        <div className="summary-card">
          <div className="card-info">
            <h3>Total Bookings</h3>
            <p>{stats.bookings}</p>
          </div>
          <div className="card-icon green">📅</div>
        </div>

        <div className="summary-card">
          <div className="card-info">
            <h3>Total Users</h3>
            <p>{stats.users}</p>
          </div>
          <div className="card-icon purple">👤</div>
        </div>

        <div className="summary-card">
          <div className="card-info">
            <h3>Total Payments</h3>
            <p>{stats.payments}</p>
          </div>
          <div className="card-icon amber">💳</div>
        </div>
      </div>

      <div className="recent-bookings">
        <div className="section-header">
          <h2>Recent Bookings</h2>
          <p>Latest vehicle rental bookings</p>
        </div>

        <table className="bookings-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Customer</th>
              <th>Vehicle</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.customer}</td>
                <td>{booking.vehicle}</td>
                <td>{booking.date}</td>
                <td>
                  <span className={`status-badge ${booking.status}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
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
