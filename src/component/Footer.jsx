import { useNavigate } from 'react-router-dom';
import './Footer.css';

const CATEGORIES = ['Car', 'SUV', 'Van', 'Motorcycle', 'Truck'];

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer-inner">

        {/* Brand */}
        <div className="footer-brand-col">
          <div className="footer-brand">
            <img src="/logo.png" alt="Mero Gadi" className="footer-logo" />
            <span>Mero <strong>Gadi</strong></span>
          </div>
          <p className="footer-tagline">
            Nepal's trusted vehicle rental platform.<br />Your ride, your way.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h5>Quick Links</h5>
          <a onClick={() => navigate('/dashboard')}>Home</a>
          <a onClick={() => navigate('/vehicles')}>Vehicles</a>
          <a onClick={() => navigate('/booking')}>My Bookings</a>
        </div>

        {/* Vehicle Types */}
        <div className="footer-col">
          <h5>Vehicle Types</h5>
          {CATEGORIES.map((c) => (
            <a key={c} onClick={() => navigate('/vehicles')}>{c}</a>
          ))}
        </div>

        {/* Contact */}
        <div className="footer-col">
          <h5>Contact Us</h5>
          <span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            Kathmandu, Nepal
          </span>
          <span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            +977-1-4XXXXXX
          </span>
          <span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            info@merogadi.com
          </span>
        </div>

      </div>

      {/* Copyright bar */}
      <div className="footer-bottom">
        <span>© 2025 Mero Gadi. All rights reserved.</span>
      </div>
    </footer>
  );
}
