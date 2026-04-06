import { createContext, useContext, useState } from 'react';

// Create the context
const AuthContext = createContext(null);

// This wraps the whole app and provides auth state to every component
export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Called when admin submits the login form
  async function login(username, password) {
    setLoading(true);
    setError(null);

    const response = await fetch('/api/admin/login.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    setLoading(false);

    if (!data.success) {
      setError(data.message || 'Login failed');
      throw new Error(data.message);
    }

    // Save admin info to localStorage
    localStorage.setItem('admin', JSON.stringify(data.admin));
  }

  function logout() {
    localStorage.removeItem('admin');
  }

  return (
    <AuthContext.Provider value={{ login, logout, loading, error, setError }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook so any component can just call useAuth()
export function useAuth() {
  return useContext(AuthContext);
}
