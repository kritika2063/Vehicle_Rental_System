import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import Vehicles from './pages/Vehicles';
import Booking from './pages/Booking';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import Landing from './component/landing';

import AdminLayout from './pages/admin/AdminLayout';
import AdminVehicles from './pages/admin/AdminVehicles';
import AdminBookings from './pages/admin/AdminBookings';
import AdminTerms from './pages/admin/AdminTerms';

// Simple check: is the user logged in?
function isLoggedIn() {
  return localStorage.getItem('user') !== null;
}

// If not logged in, redirect to /login
function ProtectedRoute({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Landing />} />

      {/* Protected routes - user must be logged in */}
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/vehicles" element={<ProtectedRoute><Vehicles /></ProtectedRoute>} />
      <Route path="/booking" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

      {/* Admin routes */}
      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route path="vehicles" element={<AdminVehicles />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="terms" element={<AdminTerms />} />
      </Route>

      {/* Catch-all 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
