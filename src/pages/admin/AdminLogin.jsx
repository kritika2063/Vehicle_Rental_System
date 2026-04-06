import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminLogin.css';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, loading, error, setError } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/admin/bookings'); // redirect to first admin page after login
    } catch {}
  }

  return (
    <div className="admin-login-page">
      <div className="login-box">
        <div className="login-header">
          <div className="login-brand">
            <span className="brand-admin">Admin</span>{' '}
            <span className="brand-panel">Panel</span>
          </div>
          <h1>Sign In</h1>
          <p>Enter your credentials to access the dashboard</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="login-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(null); }}
              autoFocus
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(null); }}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-login"
            disabled={loading || !username || !password}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          MeroGadi &mdash; Vehicle Rental Platform
        </div>
      </div>
    </div>
  );
}
