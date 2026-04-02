import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
// import { GOOGLE_CLIENT_ID } from '../constants/globals';
const GOOGLE_CLIENT_ID = '537729065202-f0287ficblsbjfgp9k5gkg0judpk2nkv.apps.googleusercontent.com';
export default function Landing() {
  const handleLoginSuccess = (credentialResponse) => {
    console.log('Login Success:', credentialResponse);
    const decoded = jwtDecode(credentialResponse.credential);
    console.log('Decoded JWT:', decoded);
    
    // TODO: Save auth token to localStorage or state management
    // localStorage.setItem('authToken', credentialResponse.credential);
  };

  const handleLoginError = () => {
    console.log('Login Failed');
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="landing">
        <h1>Welcome to Mero Gadi</h1>
        <p>Sign in with your Google account to continue</p>
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={handleLoginError}
        />
      </div>
    </GoogleOAuthProvider>
  );
}
