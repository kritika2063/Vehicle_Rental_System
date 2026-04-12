import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Car, Menu, X } from 'lucide-react';
import { useState } from 'react';
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));

  const navLinks = [
    { to: '/dashboard', label: 'Home' },
    { to: '/vehicles', label: 'Vehicles' },
    { to: '/booking', label: 'My Bookings' },
  ];

  function handleLogout() {
    localStorage.removeItem('user');
    navigate('/login');
  }

  function closeMobile() {
    setMobileOpen(false);
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-logo">
          <img src="/logo.png" alt="Mero Gadi" style={{ width: 28, height: 28, objectFit: 'contain' }} />
          <span className="logo-text">Mero <span style={{ color: '#1d4ed8' }}>Gadi</span></span>
        </Link>

        {user && (
          <div className="navbar-center desktop-only">
            <ul className="nav-menu">
              {navLinks.map((link) => (
                <li key={link.to} className="nav-item">
                  <Link
                    to={link.to}
                    className={`nav-link-button${location.pathname === link.to ? ' active' : ''}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="navbar-right desktop-only">
          {user ? (
            <div className="navbar-user">
              <span className="user-pill">👤 {user.name}</span>
              <button className="nav-link-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="nav-link-button">Login</Link>
          )}
        </div>

        <button
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="mobile-menu">
          {user && navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link-button${location.pathname === link.to ? ' active' : ''}`}
              onClick={closeMobile}
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <button className="nav-link-button" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <Link to="/login" className="nav-link-button" onClick={closeMobile}>
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
