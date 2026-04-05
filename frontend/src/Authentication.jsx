import React from 'react';
import './Auth.css';
import appLogo from './assets/logo.png';    
          const Authentication = () => {
            return (
              <div className="auth-container">
                <div className="auth-card">
                  <div className="auth-logo">
                    <img src={appLogo} alt="App Logo" className="google-icon" />
                  </div>
                  <h2>Welcome to Mero Gadi</h2>
                  <p className="auth-subtitle">Sign in to continue</p>
                </div>
              </div>
            );
          };

          export default Authentication;
