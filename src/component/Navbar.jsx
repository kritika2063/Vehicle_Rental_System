import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Car, Menu, X } from 'lucide-react';
import { useState } from 'react';
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Get the logged-in user from localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/vehicles', label: 'Vehicles' },
    { to: '/booking', label: 'My Bookings' },
  ];

  function handleLogout() {
    localStorage.removeItem('user');
    navigate('/login');
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon"><Car size={20} color="#1d4ed8" /></span>
          <span className="logo-text">Mero <span style={{ color: '#1d4ed8' }}>Gadi</span></span>
        </Link>

        {/* Desktop nav links - only show when logged in */}
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
              <button className="nav-link-button" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <Link to="/login" className="nav-link-button">Login</Link>
          )}
        </div>

        <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="mobile-menu">
          {user && navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link-button${location.pathname === link.to ? ' active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <button className="nav-link-button" onClick={handleLogout}>Logout</button>
          ) : (
            <Link to="/login" className="nav-link-button" onClick={() => setMobileOpen(false)}>Login</Link>
          )}
        </div>
      )}
    </nav>
  );
}
