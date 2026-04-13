import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    localStorage.removeItem('admin');
    navigate('/admin/login');
  }

  const navLinks = [
    { to: '/admin/dashboard', label: 'Dashboard' },
    { to: '/admin/vehicles', label: 'Vehicles' },
    { to: '/admin/bookings', label: 'Bookings' },
    { to: '/admin/terms', label: 'Terms' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif' }}>
      <aside style={{ width: '220px', background: '#1e293b', color: '#fff', display: 'flex', flexDirection: 'column', padding: '24px 0', flexShrink: 0 }}>
        <div style={{ padding: '0 20px 24px', borderBottom: '1px solid #334155' }}>
          <span style={{ fontWeight: 700, fontSize: '18px', color: '#fff' }}>Mero</span>
          <span style={{ fontWeight: 700, fontSize: '18px', color: '#3b82f6' }}>Gadi</span>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>Admin Panel</div>
        </div>
        <nav style={{ padding: '16px 12px', flex: 1 }}>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                display: 'block',
                padding: '10px 12px',
                borderRadius: '8px',
                color: location.pathname === link.to ? '#fff' : '#94a3b8',
                background: location.pathname === link.to ? '#3b82f6' : 'transparent',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 500,
                marginBottom: '4px',
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div style={{ padding: '16px 12px', borderTop: '1px solid #334155' }}>
          <button
            onClick={handleLogout}
            style={{ width: '100%', padding: '10px 12px', background: 'transparent', border: '1px solid #475569', color: '#94a3b8', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}
          >
            Logout
          </button>
        </div>
      </aside>
      <main style={{ flex: 1, overflow: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
