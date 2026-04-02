import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const AdminLayout = () => (
  <div>
    <h2>Admin Panel</h2>
    <nav style={{ padding: '8px 0' }}>
      <Link to="vehicles" style={{ marginRight: '10px' }}>Vehicles</Link>
      <Link to="bookings" style={{ marginRight: '10px' }}>Bookings</Link>
      <Link to="terms">Terms</Link>
    </nav>
    <Outlet />
  </div>
);

export default AdminLayout;
