import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const GOOGLE_CLIENT_ID = '537729065202-f0287ficblsbjfgp9k5gkg0judpk2nkv.apps.googleusercontent.com';

export default function Landing() {
  const navigate = useNavigate();

  const handleLoginSuccess = (credentialResponse) => {
    // Decode the Google JWT to get user info (name, email, picture)
    const user = jwtDecode(credentialResponse.credential);

    // Save user info to localStorage so we can access it across pages
    localStorage.setItem('user', JSON.stringify(user));

    // Redirect to home after login
    navigate('/');
  };

  const handleLoginError = () => {
    alert('Login failed. Please try again.');
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="landing">
        <h1>Welcome to Mero Gadi</h1>
        <p>Sign in with your Google account to continue</p>
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            const user = jwtDecode(credentialResponse.credential);
            console.log(user);
          }}
          onError={handleLoginError}
        />
      </div>
    </GoogleOAuthProvider>
  );
}
