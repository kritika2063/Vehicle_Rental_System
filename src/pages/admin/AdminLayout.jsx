import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

export default function AdminLayout() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem('admin');
    navigate('/admin/login');
  }

  return (
    <div>
      <nav style={{ padding: '12px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <span style={{ fontWeight: 700, marginRight: 'auto' }}>Admin Panel</span>
        <Link to="/admin/vehicles">Vehicles</Link>
        <Link to="/admin/bookings">Bookings</Link>
        <Link to="/admin/terms">Terms</Link>
        <button onClick={handleLogout} style={{ marginLeft: '16px', cursor: 'pointer' }}>Logout</button>
      </nav>
      <Outlet />
    </div>
  );
}
