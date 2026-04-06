import { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import '../Auth.css';

const GOOGLE_CLIENT_ID = '537729065202-f0287ficblsbjfgp9k5gkg0judpk2nkv.apps.googleusercontent.com';

export default function Authentication() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLoginSuccess = async (credentialResponse) => {
    setLoading(true);
    setError(null);

    // Step 1: Decode the Google JWT to get user info
    const googleUser = jwtDecode(credentialResponse.credential);

    try {
      // Step 2: Send user data to our backend
      // Backend checks if user exists → creates account or updates last_login
      const response = await fetch('/api/auth/google_login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(googleUser),
      });

      const data = await response.json();

      // Step 3: Only proceed if backend confirmed success
      if (!data.success) {
        setError('Could not sign in. Please try again.');
        setLoading(false);
        return;
      }

      // Step 4: Save the user returned from backend to localStorage
      localStorage.setItem('user', JSON.stringify(data.user));

      // Step 5: Go to dashboard
      navigate('/dashboard');

    } catch (err) {
      // Network error or server is down
      setError('Cannot connect to server. Please try again later.');
      setLoading(false);
    }
  };

  const handleLoginError = () => {
    setError('Google sign-in failed. Please try again.');
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-icon">
            <img src="/logo.png" alt="Mero Gadi" />
          </div>
          <h2>Welcome to Mero Gadi</h2>
          <p>Sign in to continue</p>

          {/* Show error message if something went wrong */}
          {error && <p className="auth-error">{error}</p>}

          {loading ? (
            <p className="auth-loading">Signing you in...</p>
          ) : (
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={handleLoginError}
              text="continue_with"
              shape="rectangular"
              theme="outline"
              size="large"
            />
          )}
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
